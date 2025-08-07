import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  id_role: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
