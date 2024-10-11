import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from '../middlewares/auth-middleware';
import { readDataFromFile } from '../utils/file-utils';
import { User } from '../types';

dotenv.config();
const router = express.Router();
const PATH = process.env.USER_DATA_PATH || '';

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    const id = req.body.userId;

    try {
        const users = await readDataFromFile<User>(PATH);

        let user = users.find((user: User) => user.id === id);          
        if (user) {
            const { firstName, lastName, email } = user;
            res.status(200).json({ firstName, lastName, email });
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('Internal server error.' + error);
    }
});

export { router as profileRouter };
