import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const PATH = process.env.POST_DATA_PATH;

router.delete('/delete-post', (req, res) => {
    const id = req.id;
    const { title } = req.body;
    if (!id) {
        return res.status(400).send('Post ID is required.');
    }

    const readStream = fs.createReadStream(PATH, { encoding: 'utf8' });
    let posts = [];

    readStream.on('data', (data) => {
        posts.push(data);
    });

    readStream.on('end', () => {
        posts = JSON.parse(posts.join(''));

        posts = posts.filter((post) => post.id !== id && post.title !== title);

        fs.writeFile(PATH, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res
                    .status(500)
                    .send('An error occurred. Please try again later.');
            }

            res.status(200).send('Post deleted successfully.');
        });
    });

    readStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
