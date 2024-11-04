import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LogsService } from './logs.service';
import { Roles } from 'src/decorators';
import { LogsDto } from './dto';

@Controller('logs')
@UseFilters(HttpExceptionFilter)
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Get()
    @Roles('ADMIN')
    async getAllLogs(@Query() query: LogsDto) {
        return this.logsService.getAllLogs(query);
    }
}