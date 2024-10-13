import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(6)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;
}
