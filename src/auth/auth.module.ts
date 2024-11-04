import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, RolesGuard } from 'src/guards';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { GoogleStrategy } from './strategy/google.strategy';

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
    ], 
    providers: [
        PrismaService,
        AuthService,
        GoogleStrategy,
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard,
        },
        {
            provide: 'APP_GUARD',
            useClass: RolesGuard,
        }
    ],
    controllers: [AuthController],
})
export class AuthModule {}