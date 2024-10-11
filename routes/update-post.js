import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH;

router.put('/post/:id', (req, res) => {
    const { title, description } = req.body;
    const userId = req.id;
    const id = req.params.id;
    if (!id) {
        return res.status(400).send('Post ID is required.');
    }

    if (!title || title.length < 3)
        return res
            .status(400)
            .send(
                'Title is required and should be at least 3 characters long.'
            );

    if (!description || description.length < 10)
        return res
            .status(400)
            .send(
                'Description is required and should be at least 10 characters long.'
            );

    const readStream = fs.createRead(PATH, { encoding: 'utf8' });
    let posts = [];

    readStream.on('data', (data) => {
        posts.push(data);
    });

    readStream.on('end', () => {
        posts = JSON.parse(posts.join(''));

        const post = posts.find(
            (post) => post.id === id && post.userId === userId
        );
        if (!post) {
            return res.status(404).send('Post not found.');
        }

        posts = posts.map((post) => {
            if (post.id === id && post.userId === userId) {
                post.title = title;
                post.description = description;
            }
        });

        const writeStream = fs.createWriteStream(PATH, { encoding: 'utf8' });
        writeStream.write(JSON.stringify(posts, null, 2));
        writeStream.end();

        res.status(201).send('Post updated successfully.');
    });

    readStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
