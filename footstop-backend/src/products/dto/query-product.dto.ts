import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer'; // Wajib untuk transformasi tipe

export class QueryProductDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Mengubah string query ('10') menjadi angka (10)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idCategory?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idBrand?: number;
}