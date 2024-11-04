import {
    Body,
    Controller,
    Post,
    Req,
    UseFilters,
    Headers,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { Public } from 'src/decorators';
import { RequestWithRawBody } from 'src/interfaces';

@Controller('order')
@UseFilters(HttpExceptionFilter)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post('create')
    public async createOrder(
        @Req() req,
        @Body() createOrderDto: CreateOrderDto
    ) {
        const userId = req.user.sub;
        return this.ordersService.createOrder(userId, createOrderDto);
    }

    @Post('webhook')
    @Public()
    public async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RequestWithRawBody
    ) {
        return this.ordersService.handleWebhook(signature, req.rawBody);
    }
}
