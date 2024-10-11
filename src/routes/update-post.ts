import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from '../middlewares/auth-middleware';
import { readDataFromFile, writeDataToFile } from '../utils/file-utils';
import { Post } from '../types';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH || '';

router.put('/post/:id', authMiddleware, async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { userId } = req.body;
    const id = req.params.id;
    if (!id) {
        res.status(400).send('Post ID is required.');
        return;
    }

    if (!title || title.length < 3) {
        res
            .status(400)
            .send(
                'Title is required and should be at least 3 characters long.'
            );
        return;
    }

    if (!description || description.length < 10) {
        res
            .status(400)
            .send(
                'Description is required and should be at least 10 characters long.'
            );
        return;
    }

    try {
        const posts = await readDataFromFile<Post>(PATH);
        const postIndex = posts.findIndex((post: Post) => post.id === id);

        if (postIndex === -1) {
            res.status(404).send('Post not found.');
            return;
        }

        if (posts[postIndex].userId !== userId) {
            res.status(403).send('You are not authorized to update this post.');
            return;
        }

        posts[postIndex].title = title;
        posts[postIndex].description = description;

        await writeDataToFile<Post>(PATH, posts);
        res.status(200).send('Post updated successfully.');
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as updatePostRouter };
