import { IsNumber, IsNotEmpty, IsUrl } from 'class-validator';
export class CreateGambarDto {
  @IsNumber()
  @IsNotEmpty()
  id_product: number;

  @IsUrl()
  @IsNotEmpty()
  url: string;


}