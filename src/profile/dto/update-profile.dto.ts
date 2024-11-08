import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({
        description: 'First name of the user',
        example: 'John',
    })
    @IsOptional()
    @IsString()
        firstName?: string;

    @ApiPropertyOptional({
        description: 'Last name of the user',
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
        lastName?: string;

    @ApiPropertyOptional({
        description: 'Birth date of the user',
        example: '1990-01-01',
        type: String,
        format: 'date',
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
        birthDate?: Date;
}