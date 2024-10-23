import winston from 'winston';

const PATH_LOG = 'app.log';
const PATH_ERROR_LOG = 'error.log';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: PATH_LOG }),
        new winston.transports.File({ filename: PATH_ERROR_LOG, level: 'error' }),
    ],
});

export default logger;
