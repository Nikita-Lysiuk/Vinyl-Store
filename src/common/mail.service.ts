import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailOptions, Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }

    async sendMail(mail: string): Promise<void> {
        const options: SendMailOptions = {
            from: process.env.EMAIL,
            to: mail,
            subject: 'Profile Updated',
            text: 'Your profile has been updated successfully.',
        };

        try {
            await this.transporter.sendMail(options);
        } catch (error) {
            throw new HttpException(
                'Internal server error ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
