import { Controller, Get, Header, Req } from '@nestjs/common';
import { MyLoggerService } from 'src/common/logger.service';
import { HealthService, jPackage } from './health.service';
import { Request } from 'express';

@Controller('health')
export class HealthController {
    constructor(
        private readonly healthService: HealthService,
        private readonly logger: MyLoggerService
    ) {}

    @Get()
    @Header('Content-Type', 'application/json')
    @Header('X-Powered-By', 'NestJS')
    @Header('Cache-Control', 'no-cache')
    @Header('Connection', 'keep-alive')
    @Header('Date', new Date().toUTCString())
    async checkHealth(@Req() req: Request): Promise<jPackage> {
        this.logger.log(`New health check request. ${req.method} ${req.url}`);
        return await this.healthService.getVersion();
    }
}
