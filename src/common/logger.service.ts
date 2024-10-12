import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';

@Injectable()
export class MyLoggerService implements LoggerService {
    private readonly logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [
                new transports.Console(),
                new transports.File({ filename: 'app.log' }),
                new transports.File({ filename: 'error.log', level: 'error' }),
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
