import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewsDto {
    @IsOptional()
    @IsString()
    @MinLength(10)
        comment: string;

    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(5)
        score: number;
}