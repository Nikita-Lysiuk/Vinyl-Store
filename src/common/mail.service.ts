import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('EMAIL'),
                pass: this.configService.get('PASSWORD')
            },
        });
    }

    async sendOrderCreationMail(mail: string, orderId: number, paymentUrl: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get('EMAIL'),
            to: mail,
            subject: 'Order Creation',
            html: `Dear Customer,<br><br>

            Thank you for your order. We are pleased to inform you that your order with ID №${orderId} has been successfully created.<br><br>

            To complete your order, please proceed with the payment by following this link: <a href="${paymentUrl}">Complete Payment</a>.<br><br>

            We will notify you once your order has been processed and shipped. If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>

            Thank you for choosing our service.<br><br>

            Best regards,<br>
            Vinyl Store Team`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendOrderConfirmationMail(mail: string, orderId: number): Promise<void> {
        const mailOptions = {
            from: this.configService.get('EMAIL'),
            to: mail,
            subject: 'Order Confirmation',
            html: `Dear Customer,<br><br>

            Thank you for your order. We are pleased to inform you that your order with ID №${orderId} has been successfully placed.<br><br>

            We will notify you once your order has been processed and shipped. If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>

            Thank you for choosing our service.<br><br>

            Best regards,<br>
            Vinyl Store Team`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendOrderFailure(mail: string, orderId: number): Promise<void> {
        const mailOptions = {
            from: this.configService.get('EMAIL'),
            to: mail,
            subject: 'Order Failure',
            html: `Dear Customer,<br><br>

            We regret to inform you that your order with ID №${orderId} could not be processed successfully.<br><br>

            If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>

            Thank you for your understanding.<br><br>

            Best regards,<br>
            Vinyl Store Team`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}