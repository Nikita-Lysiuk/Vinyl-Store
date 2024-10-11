import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).send('Access denied. No token provided.');
        return;
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY || '') as { userId: string };
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.' + error);
    }
}