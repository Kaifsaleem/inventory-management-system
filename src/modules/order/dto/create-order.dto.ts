import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    description: 'ID of the client',
    example: '12345',
  })
  @IsNotEmpty()
  clientId: string;
  @ApiProperty({
    description: 'Particular of the order',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  particular: string;

  @ApiProperty({
    description: 'Weight of the order',
    example: 1.5,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'Rate of the order',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  rate: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderDto],
    description: 'Array of order details',
  })
  @IsNotEmpty()
  orders: OrderDto[];
}
