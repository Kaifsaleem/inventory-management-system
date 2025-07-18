import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PaymentType } from '../payment.schema';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID of the invoice this payment is for',
    example: '64f7b1c9e4b0a12345678901',
  })
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 1500.5,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Type of payment',
    enum: PaymentType,
    example: PaymentType.CASH,
  })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;

  @ApiProperty({
    description: 'Optional note for the payment',
    example: 'Partial payment for order #123',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
