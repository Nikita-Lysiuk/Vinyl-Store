import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewsDto {
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(300)
        comment: string;

    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(5)
        score: number;
}