import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
    @ApiProperty({
        description: 'ID of the vinyl',
        example: 1,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
        vinylId: number;

    @ApiProperty({
        description: 'Quantity of the vinyl',
        example: 2,
        minimum: 1,
        maximum: 10,
    })
    @IsInt()
    @Min(1)
    @Max(10)
        quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({
        description: 'Array of order items',
        type: [OrderItemDto],
        minItems: 1,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
        items: OrderItemDto[];
}