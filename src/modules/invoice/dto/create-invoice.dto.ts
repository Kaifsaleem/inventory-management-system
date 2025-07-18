import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsString, IsNumber } from 'class-validator';

export class ItemDto {
  @ApiProperty({
    description: 'Particular of the item',
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

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'ID of the client',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiProperty({
    description: 'Array of order IDs to be included in the invoice',
    type: [ItemDto],
  })
  @IsNotEmpty()
  @IsArray()
  items: ItemDto[];
}
