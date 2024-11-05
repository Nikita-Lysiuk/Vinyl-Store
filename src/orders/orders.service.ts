import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateOrderDto } from './dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { MailService, StripeService } from 'src/common';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    private readonly successUrl: string =
        this.configService.get('STRIPE_SUCCESS_URL');
    private readonly cancelUrl: string =
        this.configService.get('STRIPE_CANCEL_URL');
    private readonly currency: string =
        this.configService.get('STRIPE_CURRENCY');

    constructor(
        private readonly prismaService: PrismaService,
        private readonly stripeService: StripeService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {}

    async createOrder(userId: number, createOrderDto: CreateOrderDto) {
        const { items } = createOrderDto;

        const orderItems = await Promise.all(
            items.map(async (item) => {
                const vinyl = await this.prismaService.vinyl.findUnique({
                    where: { id: item.vinylId },
                });
                if (!vinyl) {
                    throw new HttpException(
                        'Vinyl not found',
                        HttpStatus.NOT_FOUND
                    );
                }
                return {
                    vinylId: vinyl.id,
                    quantity: item.quantity,
                    price: vinyl.price,
                };
            })
        );

        const order = await this.prismaService.order.create({
            data: {
                userId,
                status: 'PENDING',
                items: {
                    create: orderItems.map((item) => ({
                        vinylId: item.vinylId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        const session = await this.stripeService.createCheckoutSession(
            this.currency,
            this.successUrl,
            this.cancelUrl,
            order.id
        );

        const email = await this.prismaService.user
            .findUnique({
                where: { id: userId },
                select: { email: true },
            })
            .then((user) => user.email);

        await this.mailService.sendOrderCreationMail(
            email,
            order.id,
            session.url
        );

        return {
            orderId: order.id,
            sessionId: session.id,
            sessionUrl: session.url,
        };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event: Stripe.Event;
        try {
            event = this.stripeService.contructEvent(
                payload,
                signature,
                endpointSecret
            );
        } catch (err) {
            throw new HttpException(
                `Webhook Error: ${err.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
        switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await this.updateOrderStatusAndSendMail(
                Number(session.metadata.orderId),
                'APPROVED',
                this.mailService.sendOrderConfirmationMail.bind(this.mailService)
            );
            break;
        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await this.updateOrderStatusAndSendMail(
                Number(paymentIntent.metadata.orderId),
                'REJECTED',
                this.mailService.sendOrderFailure.bind(this.mailService)
            );
            break;
        default:
            throw new HttpException(
                'Invalid event type',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    private async updateOrderStatusAndSendMail(
        orderId: number,
        status: OrderStatus,
        emailNotificationCallback: (email: string, orderId: number) => Promise<void>
    ) {
        await this.prismaService.order.update({
            where: { id: orderId },
            data: { status },
        });
        const order = await this.prismaService.order.findUnique({
            where: { id: orderId },
            include: { user: { select: { email: true } } },
        });

        if (!order || !order.user) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        await emailNotificationCallback(order.user.email, orderId);
    }
}
