import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  id_order: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string; // contoh: 'gopay', 'credit_card', 'bank_transfer'
}