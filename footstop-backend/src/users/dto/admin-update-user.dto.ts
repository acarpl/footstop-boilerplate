import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;
  
  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsNumber()
  id_role?: number;
}