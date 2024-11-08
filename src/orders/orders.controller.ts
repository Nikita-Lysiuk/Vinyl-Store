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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiHeader } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('order')
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post('create')
    @ApiOperation({
        summary: 'Create a new order',
        description: 'Create a new order for the authenticated user',
        tags: ['orders', 'post'],
    })
    @ApiResponse({ status: 201, description: 'Order has been created' })
    @ApiBody({ type: CreateOrderDto })
    public async createOrder(
        @Req() req,
        @Body() createOrderDto: CreateOrderDto
    ) {
        const userId = req.user.sub;
        return this.ordersService.createOrder(userId, createOrderDto);
    }

    @Post('webhook')
    @Public()
    @ApiOperation({
        summary: 'Handle Stripe webhook',
        description: 'Handle Stripe webhook events',
        tags: ['orders', 'webhook'],
    })
    @ApiResponse({ status: 200, description: 'Webhook handled successfully' })
    @ApiHeader({
        name: 'stripe-signature',
        description: 'Stripe signature header',
        required: true,
    })
    public async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RequestWithRawBody
    ) {
        return this.ordersService.handleWebhook(signature, req.rawBody);
    }
}