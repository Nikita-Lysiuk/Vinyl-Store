import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VinylsModule } from './vinyls/vinyls.module';
import { ProfileModule } from './profile/profile.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LogsModule } from './logs/logs.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './database/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,    
            envFilePath: '.env',
        }),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                token: configService.get('TELEGRAM_BOT_TOKEN'),
            }),
            inject: [ConfigService],
        }),
        PrismaModule,
        OrdersModule,
        AuthModule,
        VinylsModule,
        ProfileModule,
        ReviewsModule,
        LogsModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        }
    ],
})
export class AppModule {}
