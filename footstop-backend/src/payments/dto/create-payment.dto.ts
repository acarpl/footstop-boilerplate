import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  idOrder: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // contoh: 'gopay', 'credit_card', 'bank_transfer'
}