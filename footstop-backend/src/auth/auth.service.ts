import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { DeepPartial } from "typeorm";

// Types for better type safety
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: Omit<User, "password" | "refreshTokenHash">;
  accessToken: string;
  refreshToken: string;
}

interface LogoutResponse {
  message: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly DEFAULT_CUSTOMER_ROLE_ID = 2;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Registers a new user with default 'customer' role.
   * @param createUserDto - User data for registration
   * @returns User object without sensitive properties
   */
  async register(
    createUserDto: CreateUserDto
  ): Promise<Omit<User, "password" | "refreshTokenHash">> {
    await this.validateEmailAvailability(createUserDto.email);

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const userData = this.buildUserData(createUserDto, hashedPassword);

    const newUser = await this.usersService.create(userData);
    return this.sanitizeUser(newUser);
  }

  /**
   * Authenticates user and returns user data with tokens.
   * @param loginDto - Login credentials
   * @returns User data with access and refresh tokens
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUserCredentials(loginDto);
    const tokens = await this.generateTokens(user);

    await this.storeRefreshToken(user.id_user, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Registers a new user and immediately logs them in.
   * @param createUserDto - User data for registration
   * @returns User data with access and refresh tokens
   */
  async registerAndLogin(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const registeredUser = await this.register(createUserDto);

    // Retrieve complete user data with relations for token generation
    const completeUser = await this.usersService.findOneById(
      registeredUser.id_user
    );

    if (!completeUser) {
      throw new InternalServerErrorException(
        "Failed to retrieve user after registration"
      );
    }

    const tokens = await this.generateTokens(completeUser);
    await this.storeRefreshToken(completeUser.id_user, tokens.refreshToken);

    return {
      user: this.sanitizeUser(completeUser),
      ...tokens,
    };
  }

  /**
   * Logs out user by removing refresh token from database.
   * @param userId - ID of the user to logout
   * @returns Success message
   */
  async logout(userId: number): Promise<LogoutResponse> {
    await this.usersService.removeRefreshToken(userId);
    return { message: "Logout successful" };
  }

  /**
   * Generates new token pair using refresh token.
   * @param userId - User ID
   * @param refreshToken - Current refresh token
   * @returns New token pair
   */
  async refreshTokens(
    userId: number,
    refreshToken: string
  ): Promise<TokenPair> {
    const user = await this.validateRefreshToken(userId, refreshToken);
    const tokens = await this.generateTokens(user);

    await this.storeRefreshToken(user.id_user, tokens.refreshToken);
    return tokens;
  }

  // Private helper methods

  /**
   * Validates if email is available for registration.
   */
  private async validateEmailAvailability(email: string): Promise<void> {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }
  }

  /**
   * Hashes password with salt.
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Builds user data object for creation.
   */
  private buildUserData(
    createUserDto: CreateUserDto,
    hashedPassword: string
  ): DeepPartial<User> {
    return {
      ...createUserDto,
      password: hashedPassword,
      role: { id_role: this.DEFAULT_CUSTOMER_ROLE_ID },
    };
  }

  /**
   * Validates user credentials for login.
   */
  private async validateUserCredentials(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  /**
   * Validates refresh token and returns user.
   */
  private async validateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<User> {
    const user = await this.usersService.findOneById(userId);
    if (!user?.refreshTokenHash) {
      throw new ForbiddenException("Access Denied");
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );
    if (!isRefreshTokenValid) {
      throw new ForbiddenException("Access Denied");
    }

    return user;
  }

  /**
   * Removes sensitive properties from user object.
   */
  private sanitizeUser(
    user: User
  ): Omit<User, "password" | "refreshTokenHash"> {
    const { password, refreshTokenHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Stores refresh token in database (UsersService handles hashing).
   */
  private async storeRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await this.usersService.updateRefreshToken(userId, refreshToken);
  }

  /**
   * Generates access and refresh token pair.
   */
  private async generateTokens(user: User): Promise<TokenPair> {
    this.validateUserForTokenGeneration(user);

    const payload = this.buildTokenPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(user.id_user),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Validates user has required relations for token generation.
   */
  private validateUserForTokenGeneration(user: User): void {
    if (!user.role) {
      throw new InternalServerErrorException(
        `User object for user ID ${user.id_user} is missing the 'role' relation`
      );
    }
  }

  /**
   * Builds JWT payload from user data.
   */
  private buildTokenPayload(user: User) {
    return {
      sub: user.id_user,
      username: user.username,
      role: user.role.nama_role,
    };
  }

  /**
   * Generates access token with user payload.
   */
  private async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      ),
    });
  }

  /**
   * Generates refresh token with minimal payload.
   */
  private async generateRefreshToken(userId: number): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get<string>(
          "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
        ),
      }
    );
  }
}
