import { Type, Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class CreateVinylRecordFromDiscogsDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
        vinylIds: number[];
}