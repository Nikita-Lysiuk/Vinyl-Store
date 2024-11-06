import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './auth/auth.module';
import { VinylsModule } from './vinyls/vinyls.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ProfileModule } from './profile/profile.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LogsModule } from './logs/logs.module';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,    
            envFilePath: '.env',
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                config: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                    password: configService.get<string>('REDIS_PASSWORD'),
                },
            }),
            inject: [ConfigService],
        }),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                token: configService.get('TELEGRAM_BOT_TOKEN'),
            }),
            inject: [ConfigService],
        }),
        OrdersModule,
        AuthModule,
        VinylsModule,
        ProfileModule,
        ReviewsModule,
        LogsModule,
    ],
    providers: [
        PrismaService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        }
    ],
    exports: [PrismaService],
})
export class AppModule {}
