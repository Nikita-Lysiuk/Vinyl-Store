import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import EventEmitter from 'events';
import nodemailer from 'nodemailer';

dotenv.config();
const router = express.Router();
const eventEmitter = new EventEmitter();
const PATH = process.env.USER_DATA_PATH;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

eventEmitter.on('profileUpdated', (userMail) => {
    const mailOptions = {
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

router.put('/profile', async (req, res) => {
    const { firstName, lastName } = req.body;
    const id = req.id;

    if (!id) {
        return res.status(400).send('User ID is required.');
    }

    if (!firstName && !lastName) {
        return res.status(400).send('First name or last name is required.');
    }

    try {
        const readStream = fs.createReadStream(PATH, { encoding: 'utf8' });
        let users = [];

        readStream.on('data', (data) => {
            users.push(data);
        });

        readStream.on('end', () => {
            users = JSON.parse(users.join(''));
            users = users.map((u) => {
                if (u.id === id) {
                    u.firstName = firstName || u.firstName;
                    u.lastName = lastName || u.lastName;
                }
                return u;
            });

            const writeStream = fs.createWriteStream(PATH, {
                encoding: 'utf8',
            });
            writeStream.write(JSON.stringify(users, null, 2));
            writeStream.end();

            const user = users.find((u) => u.id === id);

            eventEmitter.emit('profileUpdated', user.email);
            res.status(200).send('Profile updated successfully.');
        });

        readStream.on('error', (err) => {
            res.status(500).send(
                'An error occurred. Please try again later.' + err
            );
        });
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
    }
});

export default router;
