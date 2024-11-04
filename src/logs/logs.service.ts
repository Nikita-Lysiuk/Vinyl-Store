import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LogsDto } from './dto';

@Injectable()
export class LogsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllLogs(query: LogsDto) {
        const { limit, offset, method, url, userId } = query; 
        const methodsArray = Array.isArray(method) ? method : [method];
        return this.prismaService.logs.findMany({
            take: limit,
            skip: offset,
            where: {
                method: {
                    in: methodsArray,
                },
                endpoint: {
                    contains: url,
                },
                ...(userId ? { userId } : {}),
            },
        });
    }
}