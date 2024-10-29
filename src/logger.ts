import { createLogger, transports, format } from 'winston';

const PATH_LOG = 'app.log';
const PATH_ERROR_LOG = 'error.log';

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.Console(),
        new transports.File({ filename: PATH_LOG }),
        new transports.File({ filename: PATH_ERROR_LOG, level: 'error' }),
    ],
});

export default logger;
