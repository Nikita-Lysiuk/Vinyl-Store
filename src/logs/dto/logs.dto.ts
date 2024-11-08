import { Method } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogsDto {
    @ApiPropertyOptional({
        description: 'Limit the number of results returned',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
        limit: number = 10;

    @ApiPropertyOptional({
        description: 'Offset the number of results returned',
        example: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
        offset: number = 0;

    @ApiPropertyOptional({
        description: 'HTTP methods to filter logs',
        example: [Method.POST, Method.PUT, Method.DELETE],
        enum: Method,
        isArray: true,
    })
    @IsOptional()
    @IsEnum(Method, { each: true })
        method: Method[] = [Method.POST, Method.PUT, Method.DELETE];

    @ApiPropertyOptional({
        description: 'URL to filter logs',
        example: '/vinyls',
    })
    @IsOptional()
    @IsString()
        url: string = '';

    @ApiPropertyOptional({
        description: 'User ID to filter logs',
        example: 1,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
        userId?: number;
}