import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthGuard, CombinedGuard, RolesGuard } from 'src/guards';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d', }
            }),
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                config: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                    password: configService.get<string>('REDIS_PASSWORD'),
                },
            }),
        }),
    ], 
    providers: [
        PrismaService,
        AuthService,
        GoogleStrategy,
        AuthGuard,  
        RolesGuard,
        {
            provide: 'APP_GUARD',
            useClass: CombinedGuard,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}