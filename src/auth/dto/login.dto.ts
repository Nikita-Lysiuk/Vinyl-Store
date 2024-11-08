import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
    @IsNotEmpty()
    @MinLength(8)
        password: string;
}