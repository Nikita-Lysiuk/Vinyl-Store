import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';

class OrderItemDto {
    @IsInt()
    @Min(0)
        vinylId: number;

    @IsInt()
    @Min(1)
    @Max(10)
        quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
        items: OrderItemDto[];
}