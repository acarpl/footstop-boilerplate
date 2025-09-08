import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { DeepPartial } from "typeorm";
import { MailerService } from "@nestjs-modules/mailer";
import { promisify } from "util";
import { randomBytes } from "crypto";
import * as crypto from "crypto";
/**
 * AuthService bertanggung jawab atas semua logika otentikasi,
 * termasuk registrasi, login, logout, dan manajemen token.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * Mendaftarkan pengguna baru dan langsung login
   */
  async registerAndLogin(createUserDto: CreateUserDto): Promise<{
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    console.log("🚀 registerAndLogin() called for email:", createUserDto.email);

    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    console.log("📝 Creating new user...");

    // Kirim password plain ke UsersService, biar dia yang hash
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: createUserDto.password, // Plain password
      role: { id_role: 2 },
    } as DeepPartial<User>);

    console.log("✅ User created, generating tokens...");

    // Generate tokens untuk user baru
    const tokens = await this._getTokens(
      newUser.id_user,
      newUser.username,
      newUser.role.nama_role
    );

    // Simpan refresh token hash
    await this.usersService.updateRefreshToken(
      newUser.id_user,
      tokens.refreshToken
    );

    console.log("🎉 registerAndLogin completed successfully");

    // Remove password dari response
    delete newUser.password;

    return {
      user: newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Mendaftarkan pengguna baru ke dalam sistem (tanpa auto login)
   */
  async register(
    createUserDto: CreateUserDto
  ): Promise<Omit<User, "password">> {
    console.log("🚀 register() called for email:", createUserDto.email);

    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    console.log("📝 Creating new user...");

    // Kirim password plain ke UsersService, biar dia yang hash
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: createUserDto.password, // Plain password
      role: { id_role: 2 },
    } as DeepPartial<User>);

    console.log("✅ User created successfully");

    // Remove password dari response
    delete newUser.password;
    return newUser;
  }

  /**
   * Mengautentikasi pengguna dan mengembalikan access token serta refresh token.
   */
  async login(
    loginDto: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log("🔍 Login attempt for email:", loginDto.email);

    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      console.log("❌ User not found for email:", loginDto.email);
      throw new UnauthorizedException("Invalid Email");
    }

    console.log("✅ User found:", {
      id: user.id_user,
      username: user.username,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
    });

    // Debug: tampilkan password yang akan dibandingkan
    console.log("🔑 Password comparison:");
    console.log("  - Input password:", loginDto.password);
    console.log("  - Input password length:", loginDto.password.length);
    console.log("  - Stored hash length:", user.password?.length);
    console.log("  - Hash starts with $2:", user.password?.startsWith("$2"));

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    console.log("🔓 Password match result:", isPasswordMatching);

    if (!isPasswordMatching) {
      console.log("❌ Password does not match");
      throw new UnauthorizedException("Invalid Password");
    }

    console.log("✅ Login successful");

    // Buat token baru
    const tokens = await this._getTokens(
      user.id_user,
      user.username,
      user.role.nama_role
    );
    // Simpan hash refresh token ke database
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );

    return tokens;
  }

  /**
   * Melakukan logout pada pengguna dengan menghapus refresh token mereka dari database.
   */
  async logout(userId: number): Promise<{ message: string }> {
    await this.usersService.removeRefreshToken(userId);
    return { message: "Logout successful" };
  }

  /**
   * Membuat sepasang token baru (access dan refresh) menggunakan refresh token yang valid.
   */
  async refreshTokens(
    userId: number,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException("Access Denied");
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );

    if (!isRefreshTokenMatching) {
      throw new ForbiddenException("Access Denied");
    }

    const tokens = await this._getTokens(
      user.id_user,
      user.username,
      user.role.nama_role
    );
    await this.usersService.updateRefreshToken(
      user.id_user,
      tokens.refreshToken
    );
    return tokens;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log(
        `Forgot Password attempt for non-existent email: ${email}. Responding with generic success message.`
      );
      return {
        message: "If a matching account exists, an email has been sent.",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${this.configService.get(
      "FRONTEND_URL"
    )}/reset-password?token=${token}`;

    console.log(`\n--- ATTEMPTING TO SEND EMAIL ---`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: Footstop - Password Reset Request`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("--------------------------------\n");

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Footstop - Password Reset Request",
        html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
      });

      // log sukses
      console.log("✅ Email sent successfully!");
    } catch (error) {
      // log error yang detail
      console.error("❌ FAILED TO SEND EMAIL. Error object:", error);
    }

    return { message: "If a matching account exists, an email has been sent." };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneByResetToken(token);

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException(
        "Password reset token is invalid or has expired."
      );
    }

    // Update password dan hapus token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersService.save(user);

    return { message: "Password has been reset successfully." };
  }

  /**
   * [HELPER] Fungsi privat untuk membuat sepasang token.
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
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.configService.get<string>(
            "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
          ),
        }
      ),
      // Membuat Refresh Token
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get<string>(
            "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
          ),
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
