import { IsNumber, IsNotEmpty, IsUrl } from 'class-validator';
export class CreateGambarDto {
  id_user: number;
  id_product: number;
  url: string;
}
