import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';

class OrderItemDto {
    @IsInt()
        vinylId: number;

    @IsInt()
        quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
        items: OrderItemDto[];
}