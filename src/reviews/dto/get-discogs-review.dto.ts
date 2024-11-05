import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetDiscogsReviewDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
        limit: number = 10;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        offset: number = 0;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        vinylId?: number;
}