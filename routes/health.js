import logger from '../logger.js';
import express from 'express';
import fs from 'fs';

const router = express.Router();

const jpackage = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

router.get('/health', (req, res) => {
    logger.info(`New health check request. ${req.method} ${req.url}`);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Date', new Date().toUTCString());
    res.json({ version: jpackage.version });
});

export default router;
