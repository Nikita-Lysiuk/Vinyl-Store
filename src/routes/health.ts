import logger from '../logger.js';
import express, { Request, Response } from 'express';
import fs from 'fs';

interface PackageJson {
    version: string;
}

const router = express.Router();

const jpackage: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

router.get('/health', (req: Request, res: Response) => {
    logger.info(`New health check request. ${req.method} ${req.url}`);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Date', new Date().toUTCString());
    res.json({ version: jpackage.version });
});

export { router as healthRouter };
