import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const POST_PATH = process.env.POST_DATA_PATH;
const USER_PATH = process.env.USER_DATA_PATH;

router.get('/post', (req, res) => {
    const userId = req.id;

    const readPostStream = fs.createReadStream(POST_PATH, { encoding: 'utf8' });
    let posts = [];

    readPostStream.on('data', (data) => {
        posts.push(data);
    });

    readPostStream.on('end', () => {
        posts = JSON.parse(posts.join(''));

        let users = [];

        const readUserStream = fs.createReadStream(USER_PATH, { encoding: 'utf8' });

        readUserStream.on('data', (data) => {
            users.push(data);
        });

        readUserStream.on('end', () => {
            users = JSON.parse(users.join(''));

            const user = users.find((user) => user.id === userId);

            posts = posts
                .filter((post) => post.userId === userId)
                .map((post) => {
                    return {
                        title: post.title,
                        description: post.description,
                        date: post.date,
                        authorName: user.firstName + ' ' + user.lastName
                    };
                });

            res.status(200).send(posts);
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
