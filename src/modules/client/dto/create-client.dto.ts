import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Street address of the client',
    example: '123 Main St',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'City of the client',
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State of the client',
    example: 'NY',
  })
  @IsString()
  state: string;
  @ApiProperty({
    description: 'Country of the client',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  country?: string;
  @ApiProperty({
    description: 'Zip code of the client',
    example: '10001',
  })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
export class CreateClientDto {
  @ApiProperty({
    description: 'Name of the client',
    example: 'John Doe',
  })
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Phone number of the client',
    example: '1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: AddressDto,
    description: 'Address of the client',
  })
  @IsNotEmpty()
  address: AddressDto;
}
