import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    lastName: string;
}
