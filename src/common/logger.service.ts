import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';

@Injectable()
export class MyLoggerService implements LoggerService {
    private readonly logger: Logger;

    private readonly PATH_LOG = 'app.log';
    private readonly PATH_ERROR_LOG = 'error.log';

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [
                new transports.Console(),
                new transports.File({ filename: this.PATH_LOG }),
                new transports.File({ filename: this.PATH_ERROR_LOG, level: 'error' }),
            ],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }

    warn(message: string) {
        this.logger.warn(message);
    }
}
