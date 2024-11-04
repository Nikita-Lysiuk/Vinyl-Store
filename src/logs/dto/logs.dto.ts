import { Method } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class LogsDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
        limit: number = 10;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
        offset: number = 0;

    @IsOptional()
    @IsEnum(Method, { each: true })
        method: Method[] = [Method.POST, Method.PUT, Method.DELETE];

    @IsOptional()
    @IsString()
        url: string = '';

    @IsOptional()
    @IsInt()
    @Type(() => Number)
        userId?: number;
}
