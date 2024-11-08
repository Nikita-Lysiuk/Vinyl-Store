import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password123',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
        password: string;

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsString()
    @IsNotEmpty()
        firstName: string;

    @ApiProperty({
        description: 'Last name of the user',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
        lastName: string;

    @ApiProperty({
        description: 'Birth date of the user',
        example: '1990-01-01',
        type: String,
        format: 'date',
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
        birthDate: Date;
}