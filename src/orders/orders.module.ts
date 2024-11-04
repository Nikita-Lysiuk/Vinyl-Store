import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MailService, StripeService } from 'src/common';

@Module({
    providers: [
        PrismaService,
        OrdersService,
        MailService,
        StripeService,
    ],
    controllers: [OrdersController]
})
export class OrdersModule {}