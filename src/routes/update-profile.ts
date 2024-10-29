import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'
import { authMiddleware } from '../middlewares/auth-middleware';
import { readDataFromFile, writeDataToFile } from '../utils/file-utils';
import { UpdateUserRequestBody, User } from '../types';

dotenv.config();
const router = express.Router();
const eventEmitter = new EventEmitter();
const PATH = process.env.USER_DATA_PATH || '';

const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

eventEmitter.on('profileUpdated', (userMail: string) => {
    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL,
        to: userMail,
        subject: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
});

router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
    const { firstName, lastName }: UpdateUserRequestBody = req.body;
    const userId: string = (req as any).userId;

    if (!firstName || firstName.length < 3) {
        res.status(400).send('First name is required and should be at least 3 characters long.');
        return;
    }

    if (!lastName || lastName.length < 3) {
        res.status(400).send('Last name is required and should be at least 3 characters long.');
        return;
    }

    try {
        const users = await readDataFromFile<User>(PATH);
        const userIndex = users.findIndex((user: User) => user.id === userId);

        if (userIndex !== -1) {
            users[userIndex].firstName = firstName;
            users[userIndex].lastName = lastName;
        }

        await writeDataToFile<User>(PATH, users);

        eventEmitter.emit('profileUpdated', users[userIndex].email);
        res.status(200).send('Profile updated successfully.');
    } catch (error) {
        res.status(500).send('Internal server error.' + error);
    }
});

export { router as updateProfileRouter };
