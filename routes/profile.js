import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const PATH = process.env.USER_DATA_PATH;

router.get('/profile', (req, res) => {
    const id = req.id;

    const readStream = fs.createReadStream(PATH, { encoding: 'utf8' });
    let users = [];

    readStream.on('data', (data) => {
        users.push(data);
    });

    readStream.on('end', () => {
        users = JSON.parse(users.join(''));

        let user = users.find((u) => u.id === id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    });

    readStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
