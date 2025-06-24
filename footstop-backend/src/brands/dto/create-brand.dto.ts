import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  brandName: string;
}