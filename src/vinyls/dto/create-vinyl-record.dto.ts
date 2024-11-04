import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateVinylRecordDto {
    @IsString()
    @MinLength(2)
        name: string;

    @IsString()
    @MinLength(2)
        authorName: string;

    @IsString()
    @MinLength(10)
        description: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.01)
        price: number;
}
