import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import logger from './logger';
import {
    healthRouter,
    registerRouter,
    loginRouter,
    profileRouter,
    updateProfileRouter,
    createPostRouter,
    getPostsRouter,
    deletePostRouter,
    updatePostRouter,
} from './routes/routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/', healthRouter);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/', profileRouter);
app.use('/', updateProfileRouter);
app.use('/', createPostRouter);
app.use('/', getPostsRouter);
app.use('/', deletePostRouter);
app.use('/', updatePostRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`An error occurred. ${err}`);
    res.status(500).send('An error occurred. Please try again later.');
});

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
