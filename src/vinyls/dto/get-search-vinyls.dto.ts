import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SortTypes {
    ASC = 'asc',
    DESC = 'desc',
}

export enum SortByTypes {
    price = 'price',
    name = 'name',
    authorName = 'authorName',
}


export class GetSearchVinylsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
        limit?: number = 10;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        offset?: number = 0;

    @IsOptional()
    @IsEnum(SortTypes)
        order?: SortTypes = SortTypes.DESC;

    @IsOptional()
    @IsEnum(SortByTypes)
        sortBy?: SortByTypes = SortByTypes.name;

    @IsOptional()
    @IsString()
        name?: string = '';

    @IsOptional()
    @IsString()
        authorName?: string = '';
}   