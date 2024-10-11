import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { readDataFromFile } from '../utils/file-utils';
import { User } from '../types';
import { generateToken, verifyPassword } from '../utils/auth-utils';

const router = express.Router();
dotenv.config();
const PATH = process.env.USER_DATA_PATH || '';

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const users = await readDataFromFile<User>(PATH);

        const user = users.find((user: User) => user.email === email);
        if (user && await verifyPassword(password, user.password)) {
            const token = generateToken(user.id);
            res.status(200).send({ token });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as loginRouter };
