import express, { Request, Response } from 'express';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { RegisterRequestBody, User } from '../types';
import dotenv from 'dotenv';
import { readDataFromFile, writeDataToFile } from '../utils/file-utils';
import { hashPassword } from '../utils/auth-utils';


const router = express.Router();
dotenv.config();
const USER_PATH = process.env.USER_DATA_PATH || '';

router.post('/register', async (req: Request, res: Response) => {
    const { firstName, lastName, email, password }: RegisterRequestBody = req.body;
    
    if (!firstName || firstName.length < 3){
        res.status(400).send('First name is required and should be at least 3 characters long.');
        return;
    }

    if (!lastName || lastName.length < 3){
        res.status(400).send('Last name is required and should be at least 3 characters long.');
        return;
    }

    if (!email || !validator.isEmail(email))
    {
        res.status(400).send('Please provide a valid email address.');
        return;
    }

    if (!password || password.length < 8){
        res.status(400).send('Password is required and should be at least 8 characters long.');
        return;
    }

    try {
        const users: User[] = await readDataFromFile<User>(USER_PATH);
        if (users.find((user: User) => user.email === email)) 
            res.status(400).send('User already exists.');


        const hashedPassword: string = await hashPassword(password);
        const user: User = {
            id: uuidv4(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }

        users.push(user);

        writeDataToFile<User>(USER_PATH, users);

        res.status(201).send('User created successfully.');
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as registerRouter };