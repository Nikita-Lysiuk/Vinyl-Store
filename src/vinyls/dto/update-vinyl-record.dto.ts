import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateVinylRecordDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
        name?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
        authorName?: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(200)
        description?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0.01)
    @MaxLength(9999.99)
        price?: number;
}
