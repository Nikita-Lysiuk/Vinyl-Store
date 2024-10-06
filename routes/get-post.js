import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const POST_PATH = process.env.POST_DATA_PATH;
const USER_PATH = process.env.USER_DATA_PATH;

router.get('/get-post', (req, res) => {
    const id = req.id;

    const readPostStream = fs.createReadStream(POST_PATH, { encoding: 'utf8' });
    let posts = [];

    readPostStream.on('data', (data) => {
        posts.push(data);
    });

    readPostStream.on('end', () => {
        posts = JSON.parse(posts.join(''));
        if (!posts.length) {
            return res.status(404).send('No posts found.');
        }

        const readUserStream = fs.createReadStream(USER_PATH, {
            encoding: 'utf8',
        });
        let users = [];

        readUserStream.on('data', (data) => {
            users.push(data);
        });

        readUserStream.on('end', () => {
            users = JSON.parse(users.join(''));
            const user = users.find((u) => u.id === id);
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const response = {
                authorName: `${user.firstName} ${user.lastName}`,
                posts: posts.map((post) => {
                    return {
                        title: post.title,
                        description: post.description,
                        date: post.date,
                    };
                }),
            };

            res.status(200).send(response);
        });

        readUserStream.on('error', (err) => {
            res.status(500).send('An error occurred. Please try again later.');
        });
    });

    readPostStream.on('error', (err) => {
        res.status(500).send('An error occurred. Please try again later.');
    });
});

export default router;
