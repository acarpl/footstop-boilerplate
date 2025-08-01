import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { RefreshTokenGuard } from './guards/refresh-token.guard'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(loginDto);
    
   const cookieOptions = {
  httpOnly: true,
  // secure HARUS false untuk development di localhost (HTTP)
  secure: process.env.NODE_ENV === 'production', 
  // 'lax' adalah pilihan yang baik untuk development
  sameSite: 'lax' as const, 
  path: '/',
};

    response.cookie('accessToken', tokens.accessToken, cookieOptions);
response.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    return { message: 'Login successful',
              accessToken: tokens.accessToken
     };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // 4. PROTEKSI ENDPOINT LOGOUT
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUser() user: User, // Ambil user yang sedang login
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.logout(user.id_user); // 5. PANGGIL SERVICE LOGOUT
    
    // Hapus kedua cookie dari browser
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return { message: 'Logout successful' };
  }

  // CATATAN: Endpoint 'refresh' ini memerlukan pembuatan Guard dan Strategy baru.
  // Anda bisa mengomentarinya terlebih dahulu jika belum membuatnya.
  
  @Post('refresh')
  @UseGuards(RefreshTokenGuard) 
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as any;
    const tokens = await this.authService.refreshTokens(user.sub, user.refreshToken);

    const cookieOptions = { httpOnly: true, secure: true, path: '/', sameSite: 'strict' as const };
    response.cookie('accessToken', tokens.accessToken, cookieOptions);
    response.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    
    return { message: 'Tokens refreshed' };
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    return user;
  }
}