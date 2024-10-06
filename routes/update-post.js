import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH;

router.put('/update-post', (req, res) => {
    const { oldTitle, newTitle, description } = req.body;
    const id = req.id;
    if (!id) {
        return res.status(400).send('Post ID is required.');
    }

    if (!oldTitle) {
        return res.status(400).send('Old title is required.');
    }

    const readStream = fs.createRead(PATH, { encoding: 'utf8' });
    let posts = [];

    readStream.on('data', (data) => {
        posts.push(data);
    });

    readStream.on('end', () => {
        posts = JSON.parse(posts.join(''));

        posts = posts.map((post) => {
            if (post.id === id && post.title === oldTitle) {
                post.title = newTitle || post.title;
                post.description = description || post.description;
            }
        });

        fs.writeFile(PATH, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res
                    .status(500)
                    .send('An error occurred. Please try again later.');
            }

            res.status(200).send('Post updated successfully.');
        });
    });

    readStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
