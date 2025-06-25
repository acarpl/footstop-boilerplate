import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  product_name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional() // Ukuran bisa jadi tidak wajib
  size?: string;

  // Kita menerima ID untuk relasi
  @IsNumber()
  @IsNotEmpty()
  idBrand: number;

  @IsNumber()
  @IsNotEmpty()
  idCategory: number;
}