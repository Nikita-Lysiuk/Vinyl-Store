import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';



export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
        password: string;

    @IsString()
    @IsNotEmpty()
        firstName: string;

    @IsString()
    @IsNotEmpty()
        lastName: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
        birthDate: Date;
}