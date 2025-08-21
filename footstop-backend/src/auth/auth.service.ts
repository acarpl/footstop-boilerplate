// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { DeepPartial } from "typeorm";

@Injectable()
export class AuthService {
  // HAPUS 'userRepository: any;'
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Register user baru (default role = customer).
   */
  async register(
    createUserDto: CreateUserDto
  ): Promise<Omit<User, "password">> {
    // ... (Logika register Anda sudah benar)
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: { id_role: 2 },
    } as DeepPartial<User>);

    delete newUser.password;
    return newUser;
  }

  /**
   * Login user, cek password & generate token
   */
  async login(loginDto: LoginDto) {
    // 1. Panggil metode validasi yang sudah diperbaiki
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // 2. Buat token
    const tokens = await this._generateTokens(user);

    // 3. Simpan hash refresh token
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );

    // 4. Kembalikan user dan token
    return {
      user: user, // user dari validateUser sudah tidak punya password
      ...tokens,
    };
  }

  /**
   * Register & login otomatis
   */
  async registerAndLogin(createUserDto: CreateUserDto) {
    const user = await this.register(createUserDto);
    // Kita perlu mengambil user lagi untuk mendapatkan objek 'role' yang lengkap
    const userWithRole = await this.usersService.findOneById(user.id_user);
    const tokens = await this._generateTokens(userWithRole);
    await this.usersService.updateRefreshToken(
      userWithRole.id_user,
      tokens.refreshToken
    );
    return { user: userWithRole, ...tokens };
  }

  /**
   * [DIPERBAIKI] Memvalidasi kredensial pengguna.
   */
  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, "password"> | null> {
    // Gunakan UsersService yang sudah di-inject, bukan userRepository yang tidak ada
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Mengembalikan objek user tanpa password
    }
    return null;
  }

  /**
   * Logout (hapus refresh token)
   */
  async logout(userId: number) {
    // ... (Logika logout Anda sudah benar)
    await this.usersService.removeRefreshToken(userId);
    return { message: "Logout successful" };
  }

  /**
   * Refresh token
   */
  async refreshTokens(userId: number, refreshToken: string) {
    // ... (Logika refreshTokens Anda sudah benar)
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException("Access Denied");

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) throw new ForbiddenException("Access Denied");

    const tokens = await this._generateTokens(user);
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );

    return tokens;
  }

  /**
   * [DIPERBAIKI] Private helper: generate access & refresh token
   */
  private async _generateTokens(user: User) {
    const payload = {
      sub: user.id_user,
      username: user.username,
      // Gunakan nama peran, bukan ID. Ini lebih baik untuk otorisasi.
      role: user.role.nama_role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: this.configService.get<string>(
          "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
        ),
      }),
      this.jwtService.signAsync(
        { sub: user.id_user },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get<string>(
            "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
          ),
        }
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
