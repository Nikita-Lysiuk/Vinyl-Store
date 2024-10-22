import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Params, Sort } from '../types';
import { Type } from 'class-transformer';

export class QueryParamsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sort?: Sort = 'DESC';

    @IsOptional()
    @IsEnum(['id', 'title', 'description', 'date', 'userId'])
    sortBy?: Params = 'date';

    @IsOptional()
    @Type(() => Object)
    search?: Partial<Record<Params, string>> = {};
}
