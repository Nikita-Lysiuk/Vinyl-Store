import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetReviewsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
        limit: number = 10;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        offset: number = 0;
}