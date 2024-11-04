import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {
        const apiKey = this.configService.get<string>('STRIPE_API_KEY');
        this.stripe = new Stripe(apiKey, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiVersion: '2024-10-28.acacia',
        });
    }

    async createCheckoutSession(currency: string, successUrl: string, cancelUrl: string, orderId: number) {
        const items = await this.prismaService.orderItem.findMany({
            where: { orderId },
            include: { vinyl: true },
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.vinyl.name,
                    images: [item.vinyl.image],
                },
                unit_amount: item.vinyl.price * 100,
            },
            quantity: item.quantity,
        }));
        
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                orderId: orderId.toString(),
            },
        });
    }

    contructEvent(payload: any, signature: string, endpointSecret: string): Stripe.Event {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        } catch (err) {
            throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}