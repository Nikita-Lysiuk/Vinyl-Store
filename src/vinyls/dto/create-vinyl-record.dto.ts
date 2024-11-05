import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateVinylRecordDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
        name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
        authorName: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
        description: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.01)
    @Max(9999.99)
        price: number;
}
