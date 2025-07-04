import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { DeepPartial } from 'typeorm';

/**
 * AuthService bertanggung jawab atas semua logika otentikasi,
 * termasuk registrasi, login, logout, dan manajemen token.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Untuk membaca .env
  ) {}

  /**
   * Mendaftarkan pengguna baru ke dalam sistem.
   * @param createUserDto - Data yang dibutuhkan untuk membuat user baru.
   * @returns Objek user yang baru dibuat, tanpa properti password.
   * @throws {ConflictException} Jika email sudah terdaftar.
   */
  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      // Semua pengguna baru secara default adalah 'customer'
      role: { id_role: 2 },
    } as DeepPartial<User>);

    // Pastikan password tidak pernah dikembalikan
    delete newUser.password;
    return newUser;
  }

  /**
   * Mengautentikasi pengguna dan mengembalikan access token serta refresh token.
   * @param loginDto - Kredensial pengguna (email dan password).
   * @returns Sebuah objek berisi accessToken dan refreshToken.
   * @throws {UnauthorizedException} Jika kredensial tidak valid.
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Buat token baru
    const tokens = await this._getTokens(user.id_user, user.username, user.role.nama_role);
    // Simpan hash refresh token ke database
    await this.usersService.updateRefreshToken(user.id_user, tokens.refreshToken);

    return tokens;
  }

  /**
   * Melakukan logout pada pengguna dengan menghapus refresh token mereka dari database.
   * @param userId - ID dari pengguna yang akan logout.
   */
  async logout(userId: number): Promise<{ message: string }> {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logout successful' };
  }

  /**
   * Membuat sepasang token baru (access dan refresh) menggunakan refresh token yang valid.
   * @param userId - ID pengguna dari payload refresh token.
   * @param refreshToken - Refresh token yang dikirim oleh klien.
   * @returns Sepasang token baru.
   * @throws {ForbiddenException} Jika refresh token tidak valid atau tidak cocok.
   */
  async refreshTokens(userId: number, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenMatching) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this._getTokens(user.id_user, user.username, user.role.nama_role);
    await this.usersService.updateRefreshToken(user.id_user, tokens.refreshToken);
    return tokens;
  }

  /**
   * [HELPER] Fungsi privat untuk membuat sepasang token.
   * @private
   */
  private async _getTokens(userId: number, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      // Membuat Access Token
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      ),
      // Membuat Refresh Token
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}