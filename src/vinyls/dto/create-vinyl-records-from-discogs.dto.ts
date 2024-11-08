import { Type, Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVinylRecordFromDiscogsDto {
    @ApiProperty({
        description: 'Array of vinyl IDs from Discogs',
        type: [Number],
        example: [1948646, 8681316],
        minItems: 1,
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
        vinylIds: number[];
}