import { IsNumber, IsNotEmpty, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  id_product: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  size?: string;
}