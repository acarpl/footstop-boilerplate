import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

// src/auth/jwt.strategy.ts (Backend)

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    // ===>>> TAMBAHKAN LOG INI <<<=========================================
    console.log('\n--- COOKIE EXTRACTOR ---');
    console.log('Cookies received by backend:', req.cookies); 
    // ====================================================================
    token = req.cookies['accessToken'];
  }
  // Log token yang ditemukan (atau tidak)
  console.log('Token extracted:', token ? 'Found' : 'Not Found');
  console.log('------------------------\n');
  return token;
};


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('\n--- JWT STRATEGY ---');
    console.log('JWT_SECRET loaded by ConfigService:', secret);
    console.log('--------------------\n');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Metode ini akan dipanggil oleh Passport secara otomatis SETELAH
   * token berhasil diverifikasi.
   * @param payload Payload yang ada di dalam token (yang kita buat di auth.service.ts)
   * @returns User object yang akan dilampirkan ke request (request.user)
   */
  async validate(payload: { sub: number; username: string; role: string }): Promise<User> {
    const { sub: id_user } = payload;
    
    // Cari user di database berdasarkan ID dari token
    const user = await this.usersService.findOneById(id_user);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // Properti 'password' seharusnya tidak ada di sini jika Anda menggunakan `select: false`
    // jadi tidak perlu di-delete, tapi jika ada, hapus untuk keamanan.
    // delete user.password; 

    return user;
  }
}