import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

export default logger;
