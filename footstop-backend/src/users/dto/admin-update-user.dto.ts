import { IsInt, IsOptional } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class AdminUpdateUserDto extends UpdateUserDto {
  @IsInt()
  @IsOptional()
  id_role?: number; // Admin bisa update role user
}
