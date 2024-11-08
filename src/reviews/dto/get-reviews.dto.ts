import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetReviewsDto {
    @ApiPropertyOptional({
        description: 'Limit the number of results returned',
        example: 10,
        minimum: 1,
        maximum: 50,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
        limit: number = 10;

    @ApiPropertyOptional({
        description: 'Offset the number of results returned',
        example: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        offset: number = 0;
}