import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
    @ApiPropertyOptional({
        description: 'Limit the number of results returned',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
        limit: number = 10;

    @ApiPropertyOptional({
        description: 'Offset the number of results returned',
        example: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
        offset: number = 0;

    @ApiPropertyOptional({
        description: 'Order of the results',
        example: SortTypes.DESC,
        enum: SortTypes,
    })
    @IsOptional()
    @IsEnum(SortTypes)
        order: SortTypes = SortTypes.DESC;

    @ApiPropertyOptional({
        description: 'Field to sort by',
        example: SortByTypes.name,
        enum: SortByTypes,
    })
    @IsOptional()
    @IsEnum(SortByTypes)
        sortBy: SortByTypes = SortByTypes.name;

    @ApiPropertyOptional({
        description: 'Filter by vinyl name',
        example: 'Abbey Road',
    })
    @IsOptional()
    @IsString()
        name: string = '';

    @ApiPropertyOptional({
        description: 'Filter by author name',
        example: 'The Beatles',
    })
    @IsOptional()
    @IsString()
        authorName: string = '';
}