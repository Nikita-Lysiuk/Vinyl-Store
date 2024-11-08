import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewsDto {
    @ApiPropertyOptional({
        description: 'Comment for the review',
        example: 'This vinyl is amazing!',
        minLength: 10,
        maxLength: 300,
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(300)
        comment: string;

    @ApiProperty({
        description: 'Score for the review',
        example: 5,
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(5)
        score: number;
}