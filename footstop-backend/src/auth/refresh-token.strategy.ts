import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Strategi ini bertanggung jawab untuk memvalidasi Refresh Token.
 * Ini berjalan pada endpoint yang secara spesifik dilindungi oleh RefreshTokenGuard.
 */
@Injectable()
// Kita memberinya nama 'jwt-refresh' agar tidak bentrok dengan strategi 'jwt' default.
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      // Memberitahu passport cara mengambil refresh token.
      // Kita akan mengambilnya dari cookie bernama 'refreshToken'.
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies['refreshToken'];
        }
        return null;
      },
      // Jangan abaikan token kadaluwarsa.
      ignoreExpiration: false,
      // Gunakan SECRET KEY yang BERBEDA dan lebih kuat untuk refresh token.
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      // PENTING: Kita perlu akses ke objek request di dalam metode validate().
      passReqToCallback: true,
    });
  }

  /**
   * Metode ini dipanggil SETELAH refresh token berhasil diverifikasi (valid dan tidak kadaluwarsa).
   * Tugasnya adalah melampirkan payload dan refresh token itu sendiri ke objek request.
   * @param req - Objek request Express.
   * @param payload - Payload yang sudah didekripsi dari refresh token.
   * @returns Objek yang akan dilampirkan ke 'request.user'.
   */
  validate(req: Request, payload: { sub: number; username: string }) {
    const refreshToken = req.cookies['refreshToken'];
    // Kita mengembalikan payload dan refresh token mentah.
    // Ini akan digunakan di AuthService untuk perbandingan dengan hash di DB.
    return {
      ...payload, // Ini akan berisi 'sub' (ID user) dan 'username'
      refreshToken,
    };
  }
}