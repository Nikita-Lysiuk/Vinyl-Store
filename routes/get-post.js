import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH;

router.get('/post', (req, res) => {
    const userId = req.id;

    const readPostStream = fs.createReadStream(PATH, { encoding: 'utf8' });
    let posts = [];

    readPostStream.on('data', (data) => {
        posts.push(data);
    });

    readPostStream.on('end', () => {
        posts = JSON.parse(posts.join(''));
        if (!posts.length) {
            return res.status(404).send('No posts found.');
        }

        posts = posts
            .filter((post) => post.userId === userId)
            .map((post) => {
                return {
                    title: post.title,
                    description: post.description,
                    date: post.date,
                    authorName: post.authorName,
                }
            });

        if (!posts.length) {
            return res.status(404).send('No posts found.');
        }
        
        res.status(200).send(posts);
    });

    readPostStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
