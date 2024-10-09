import express from 'express';
import bcrypt from 'bcrypt';
import logger from '../logger.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();
const router = express.Router();
const PATH = process.env.USER_DATA_PATH;

router.post('/register', (req, res) => {
    let { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email.');
    }

    if (!firstName || firstName.length < 3) 
        return res.status(400).send('First name is required and should be at least 3 characters long.');

    if (!lastName || lastName.length < 3)
        return res.status(400).send('Last name is required and should be at least 3 characters long.');

    if (!password || password.length < 8)
        return res.status(400).send('Password is required and should be at least 8 characters long.');

    let salt = 10;
    let hashedPassword = bcrypt.hashSync(password, salt);
    let id = uuidv4();

    let user = { id, firstName, lastName, email, password: hashedPassword };

    try {
        const readStream = fs.createReadStream(PATH, { encoding: 'utf8' });

        let users = [];

        readStream.on('data', (data) => {
            users.push(data);
        });

        readStream.on('end', () => {
            users = JSON.parse(users.join(''));
            users.push(user);

            const stream = fs.createWriteStream(PATH, { flags: 'w' });
            stream.write(JSON.stringify(users));
            stream.end();
            res.status(201).send('User registered successfully.');
        });

        readStream.on('error', (err) => {
            logger.error(`An error occurred. ${err}`);
            res.status(500).send('An error occurred. Please try again later.');
        });

    } catch (err) {
        logger.error(`An error occurred. ${err}`);
        res.status(500).send('An error occurred. Please try again later.');
    }
});

export default router;
