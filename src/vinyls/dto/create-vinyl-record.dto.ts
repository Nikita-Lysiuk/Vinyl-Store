import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVinylRecordDto {
    @ApiProperty({
        description: 'Name of the vinyl record',
        example: 'Abbey Road',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
        name: string;

    @ApiProperty({
        description: 'Name of the author or artist',
        example: 'The Beatles',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
        authorName: string;

    @ApiProperty({
        description: 'Description of the vinyl record',
        example: 'A classic album by The Beatles, released in 1969.',
        minLength: 10,
        maxLength: 200,
    })
    @IsString()
    @MinLength(10)
    @MaxLength(200)
        description: string;

    @ApiProperty({
        description: 'Price of the vinyl record',
        example: 19.99,
        minimum: 0.01,
        maximum: 9999.99,
        type: Number,
    })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.01)
    @Max(9999.99)
        price: number;
}