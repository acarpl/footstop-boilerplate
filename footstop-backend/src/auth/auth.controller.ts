import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint untuk mendaftarkan user baru.
   * Menggunakan ValidationPipe untuk memastikan data sesuai DTO.
   */
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * Endpoint untuk login dan mendapatkan JWT token.
   * HttpStatus.OK (200) adalah status yang umum untuk login berhasil.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}