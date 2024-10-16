import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    readonly firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    readonly lastName: string;
}
