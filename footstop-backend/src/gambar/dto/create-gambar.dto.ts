import { IsNumber, IsNotEmpty, IsUrl } from 'class-validator';
export class CreateGambarDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  id_product: number;
}