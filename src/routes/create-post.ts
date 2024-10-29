import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middlewares/auth-middleware';
import { readDataFromFile, writeDataToFile } from '../utils/file-utils';
import { CreatePostRequestBody, Post } from '../types';

const router = express.Router();
dotenv.config();
const POST_PATH = process.env.POST_DATA_PATH || '';

router.post('/post', authMiddleware, async (req: Request, res: Response) => {
    const { title, description }: CreatePostRequestBody = req.body;
    const userId: string = (req as any).userId;

    if (!title || title.length < 3) {
        res.status(400).send('Title is required and should be at least 3 characters long.');
        return;
    }

    if (!description || description.length < 10) {
        res.status(400).send('Description is required and should be at least 10 characters long.');
        return;
    }

    try {
        const post: Post = {
            id: uuidv4(),
            title,
            description,
            date: new Date().toISOString(),
            userId,
        };

        const posts = await readDataFromFile<Post>(POST_PATH);
        posts.push(post);
        await writeDataToFile<Post>(POST_PATH, posts);
        res.status(201).send('Post created successfully.');

    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as createPostRouter };
