import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateVinylRecordDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
        name: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
        authorName: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
        description: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.01)
        price: number;
}
