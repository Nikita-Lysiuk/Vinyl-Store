const http = require('http');
const jpackage = require('./package.json');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config();

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        logger.info(`New health check request. ${req.method} ${req.url}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Powered-By', 'Node.js');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Date', new Date().toUTCString());
        res.write(JSON.stringify({ version: jpackage.version }));
        res.end();
    } else {
        logger.error(`Invalid request. ${req.method} ${req.url}`);
        res.statusCode = 404;
        res.end();
    }
});

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});