import { IsNumber, IsNotEmpty, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  idProduct: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  size?: string;
}