import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

const router = express.Router();
dotenv.config();
const PATH = process.env.POST_DATA_PATH;

router.post('/create-post', (req, res) => {
    const { title, description } = req.body;
    const date = new Date().toISOString();
    const id = req.id;

    if (!title || !description) {
        return res.status(400).send('All input is required.');
    }

    const post = { id, title, description, date };

    try {
        const postsData = fs.readFileSync(PATH, 'utf8');
        let posts = [];
        if (postsData) {
            posts = JSON.parse(postsData);
        }

        posts.push(post);

        const stream = fs.createWriteStream(PATH, { flags: 'w' });
        stream.write(JSON.stringify(posts));
        stream.end();

        return res.status(201).send('Post created successfully.');
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
    }

    res.status(201).send('Post created successfully.');
});

export default router;
