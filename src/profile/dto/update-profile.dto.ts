import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
        firstName?: string;

    @IsOptional()
    @IsString()
        lastName?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
        birthDate?: Date;
}