import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    title: string;

    @IsString()
    @MinLength(10)
    @MaxLength(100)
    description: string;
}
