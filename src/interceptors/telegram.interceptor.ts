import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vinyl } from '@prisma/client';
import { InjectBot } from 'nestjs-telegraf';
import { mergeMap, Observable } from 'rxjs';
import { TelegrafContext } from 'src/interfaces';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramInterceptor implements NestInterceptor {
    constructor(
        private readonly configService: ConfigService,
        @InjectBot() private readonly bot: Telegraf<TelegrafContext>
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Vinyl | Vinyl[]> {
        return next.handle().pipe(
            mergeMap(async (data: Vinyl | Vinyl[]) => {
                const chatId = this.configService.get('TELEGRAM_CHANNEL_ID');
                const linkToStore = this.configService.get('LINK_TO_STORE');

                if (Array.isArray(data)) {
                    data.forEach(async (vinyl) => {
                        await this.sendTelegramMessage(chatId, vinyl, linkToStore);
                    });
                } else {
                    await this.sendTelegramMessage(chatId, data, linkToStore);
                }

                return data;
            }),
        );
    }

    private async sendTelegramMessage(chatId: string, vinyl: Vinyl, linkToStore: string) {
        await this.bot.telegram.sendPhoto(chatId, vinyl.image, {
            caption: `🎵 <b>New Vinyl Available!</b> 🎵\n\n<b>${vinyl.name}</b> by <i>${vinyl.authorName}</i>`,
            parse_mode: 'HTML',
        });

        await this.bot.telegram.sendMessage(chatId, `📝 <b>Description:</b>\n${vinyl.description}\n\n💵 <b>Price:</b> $${vinyl.price}\n\n🛒 <a href="http://${linkToStore}/vinyls/${vinyl.id}">Buy Now</a>`, {
            parse_mode: 'HTML',
        });
    }
}
