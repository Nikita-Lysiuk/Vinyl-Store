import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MailService } from 'src/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, MailService],
})
export class UsersModule {}
