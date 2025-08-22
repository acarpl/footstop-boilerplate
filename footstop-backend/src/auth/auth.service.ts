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
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Mendaftarkan pengguna baru dengan peran default 'customer'.
   * @returns Objek user yang baru dibuat, tanpa properti password.
   */
  async register(
    createUserDto: CreateUserDto
  ): Promise<Omit<User, "password" | "refreshTokenHash">> {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: { id_role: 2 }, // Asumsi ID 2 adalah customer
    } as DeepPartial<User>);

    // Hapus properti sensitif sebelum dikembalikan
    delete newUser.password;
    delete newUser.refreshTokenHash;
    return newUser;
  }

  /**
   * Mengautentikasi pengguna dan mengembalikan data user beserta token.
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this._generateTokens(user);
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );

    // Hapus properti sensitif dari objek user yang akan dikembalikan
    delete user.password;
    delete user.refreshTokenHash;

    return { user, ...tokens };
  }

  async registerAndLogin(createUserDto: CreateUserDto) {
    // 1. Daftarkan user baru. Hasilnya adalah objek user tanpa password.
    const registeredUser = await this.register(createUserDto);

    // 2. AMBIL KEMBALI data user yang lengkap dari database.
    // Ini penting untuk mendapatkan semua relasi (seperti 'role') dan ID yang benar.
    const userForToken = await this.usersService.findOneById(
      registeredUser.id_user
    );

    if (!userForToken) {
      // Ini seharusnya tidak pernah terjadi, tapi ini adalah pengaman yang baik
      throw new UnauthorizedException(
        "Failed to retrieve user after registration."
      );
    }

    // 3. Sekarang 'userForToken' adalah objek User yang lengkap, aman untuk membuat token.
    const tokens = await this._generateTokens(userForToken);

    // 4. Simpan hash refresh token.
    await this.usersService.updateRefreshToken(
      userForToken.id_user,
      tokens.refreshToken
    );

    // Hapus properti sensitif sebelum dikembalikan
    delete userForToken.password;
    delete userForToken.refreshTokenHash;

    return { user: userForToken, ...tokens };
  }

  /**
   * Menghapus sesi refresh token dari database.
   */
  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: "Logout successful" };
  }

  /**
   * Membuat sepasang token baru menggunakan refresh token.
   */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException("Access Denied");

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );
    if (!isRefreshTokenMatching) throw new ForbiddenException("Access Denied");

    const tokens = await this._generateTokens(user);
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );

    return tokens;
  }

  /**
   * Helper privat untuk membuat access dan refresh token.
   */
  private async _generateTokens(user: User) {
    if (!user.role) {
      throw new Error(
        `User object for user ID ${user.id_user} is missing the 'role' relation.`
      );
    }

    const payload = {
      sub: user.id_user,
      username: user.username,
      role: user.role.nama_role, // Menggunakan nama peran, bukan ID
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
