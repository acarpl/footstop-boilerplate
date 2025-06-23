import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Impor UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, // <-- Agar bisa inject UsersService
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // .env
        signOptions: { expiresIn: '1d' }, // 1 day expiration
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], // Agar bisa inject AuthService
})
export class AuthModule {}