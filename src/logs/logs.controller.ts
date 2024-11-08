import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LogsService } from './logs.service';
import { Roles } from 'src/decorators';
import { LogsDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Get()
    @Roles('ADMIN')
    @ApiOperation({
        summary: 'Get all logs',
        description: 'Retrieve all logs based on query parameters',
        tags: ['logs', 'get'],
    })
    @ApiResponse({ status: 200, description: 'List of logs' })
    async getAllLogs(@Query() query: LogsDto) {
        return this.logsService.getAllLogs(query);
    }
}