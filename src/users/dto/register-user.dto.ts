import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsString()
    @MinLength(2)
    readonly firstName: string;

    @IsString()
    @MinLength(2)
    readonly lastName: string;
}
