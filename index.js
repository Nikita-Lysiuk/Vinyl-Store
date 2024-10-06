import express from 'express';
import dotenv from 'dotenv';
import logger from './logger.js';
import authMiddleware from './middleware/authMiddleware.js';
import {
    healthRouter,
    registerRouter,
    loginRouter,
    profileRouter,
    profileUpdateRouter,
    createPostRouter,
    getPostRouter,
    deletePostRouter,
    updatePostRouter,
} from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', healthRouter);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use(authMiddleware);
app.use('/', profileRouter);
app.use('/', profileUpdateRouter);
app.use('/', createPostRouter);
app.use('/', getPostRouter);
app.use('/', deletePostRouter);
app.use('/', updatePostRouter);

app.use((err, req, res, next) => {
    logger.error(`An error occurred. ${err}`);
    res.status(500).send('An error occurred. Please try again later.');
});

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
