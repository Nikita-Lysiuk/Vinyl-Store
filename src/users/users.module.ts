import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { FilesService, MailService } from 'src/common';

dotenv.config();

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, FilesService, MailService],
})
export class UsersModule {}
