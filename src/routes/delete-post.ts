import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from '../middlewares/auth-middleware';
import { readDataFromFile, writeDataToFile } from '../utils/file-utils';
import { Post } from '../types';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH || '';

router.delete('post/:id', authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const posts = await readDataFromFile<Post>(PATH);
        const postIndex = posts.findIndex((post: Post) => post.id === id);

        if (postIndex === -1) {
            res.status(404).send('Post not found.');
            return;
        }

        if (posts[postIndex].userId !== userId) {
            res.status(403).send('You are not authorized to delete this post.');
            return;
        }

        posts.splice(postIndex, 1);
        await writeDataToFile<Post>(PATH, posts);
        res.status(200).send('Post deleted successfully.');
    } catch (error) {
        res.status(500).send('An error occurred. Please try again later.' + error);
    }
});

export { router as deletePostRouter };
