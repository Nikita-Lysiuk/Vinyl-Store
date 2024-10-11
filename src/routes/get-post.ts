import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Post, User } from '../types';
import { readDataFromFile } from '../utils/file-utils';

dotenv.config();
const router = express.Router();
const POST_PATH = process.env.POST_DATA_PATH || '';
const USER_PATH = process.env.USER_DATA_PATH || '';

interface IPostResponse {
    title: string;
    description: string;
    date: string;
    authorName: string;
}

router.get('/post', async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        const posts = await readDataFromFile<Post>(POST_PATH);
        const users = await readDataFromFile<User>(USER_PATH);

        const user = users.find((user: User) => user.id === userId);

        const postResponse: IPostResponse[] = posts
                                .filter((post: Post) => post.userId === userId)
                                .map((post: Post) => {
                                    return {
                                        title: post.title,
                                        description: post.description,
                                        date: post.date,
                                        authorName: `${user?.firstName} ${user?.lastName}`
                                    }
                                });

        res.status(200).send(postResponse);
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as getPostsRouter };
