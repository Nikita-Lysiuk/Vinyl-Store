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

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send('All input is required.');
    }

    let salt = 10;
    let hashedPassword = bcrypt.hashSync(password, salt);
    let id = uuidv4();

    let user = { id, firstName, lastName, email, password: hashedPassword };

    try {
        const usersData = fs.readFileSync(PATH, 'utf8');
        if (usersData.find((u) => u.email === email)) {
            return res.status(400).send('User already exists.');
        }

        let users = [];
        if (usersData) {
            users = JSON.parse(usersData);
        }

        users.push(user);

        const stream = fs.createWriteStream(PATH, { flags: 'w' });
        stream.write(JSON.stringify(users));
        stream.end();

        res.status(201).send('User registered successfully.');
    } catch (err) {
        logger.error(`An error occurred. ${err}`);
        res.status(500).send('An error occurred. Please try again later.');
    }
});

export default router;
