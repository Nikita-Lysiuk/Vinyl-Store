import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MyLoggerService } from 'src/common/logger.service';

@Module({
    controllers: [HealthController],
    providers: [HealthService, MyLoggerService],
})
export class HealthModule {}
