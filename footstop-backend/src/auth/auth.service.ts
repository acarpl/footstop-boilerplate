import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthService {
  userRepository: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register user baru (default role = customer) tanpa error.
   */
async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Cek email sudah terdaftar
  const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
  if (existingUser) throw new ConflictException('Email already registered');
  // Hash password
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  // Buat user baru, otomatis set role customer (id_role = 1)
  const newUser = await this.usersService.create({
    ...createUserDto,
    password: hashedPassword,
    role: { id_role: 1 }, // default customer
  } as DeepPartial<User>);

  delete newUser.password;
  return newUser;
}


  /**
   * Login user, cek password & generate token
   */
async login(loginDto: LoginDto) {
  const user = await this.usersService.findOneByEmail(loginDto.email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
  if (!isPasswordMatching) throw new UnauthorizedException('Invalid credentials');

  const tokens = await this._generateTokens(user);
  await this.usersService.updateRefreshToken(user.id_user, tokens.refreshToken);

  // Hapus password sebelum dikirim
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword, // sudah termasuk role.nama_role
    ...tokens,
  };
}

  /**
   * Register & login otomatis (untuk register frontend)
   */
  async registerAndLogin(createUserDto: CreateUserDto) {
    // 1. Register user baru
    const user = await this.register(createUserDto);

    // 2. Generate token
    const tokens = await this._generateTokens(user as User);

    // 3. Simpan refresh token hash
    await this.usersService.updateRefreshToken((user as User).id_user, tokens.refreshToken);

    return { user, ...tokens };
  }
  
// validate user
async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.userRepository.findOne({
    where: { email },
    relations: ['role'], // ini penting agar role ikut diambil
  });

  if (user && await bcrypt.compare(pass, user.password)) {
    const { password, ...result } = user;
    return result; // sudah ada role.nama_role di sini
  }
  return null;
}

  /**
   * Logout (hapus refresh token)
   */
  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logout successful' };
  }

  /**
   * Refresh token
   */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshTokenHash) throw new ForbiddenException('Access Denied');

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) throw new ForbiddenException('Access Denied');

    const tokens = await this._generateTokens(user);
    await this.usersService.updateRefreshToken(user.id_user, tokens.refreshToken);

    return tokens;
  }

  /**
   * Private helper: generate access & refresh token
   */
  private async _generateTokens(user: User) {
    const payload = { sub: user.id_user, username: user.username, role: user.id_role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync({ sub: user.id_user }, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
