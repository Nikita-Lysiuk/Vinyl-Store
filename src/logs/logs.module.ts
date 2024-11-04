import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';

@Module({
    providers: [
        PrismaService,
        LogsService,
    ],
    controllers: [LogsController]
})
export class LogsModule {}