import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Secara default, nama strateginya adalah 'jwt'
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Memberitahu passport cara mengambil token dari header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Jangan abaikan token kadaluwarsa
      ignoreExpiration: false,
      // Gunakan secret key dari .env untuk verifikasi
      secretOrKey: configService.get<string>('JWT_SECRET'),
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