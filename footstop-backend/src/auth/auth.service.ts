import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // SOLUSI 1: Gunakan nama properti yang benar dan hapus 'as any'
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: { id_role: 2 }, // Asumsi nama PK di Role adalah id_role
    });

    delete newUser.password;
    return newUser;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    // 1. Cari user berdasarkan email
    const user = await this.usersService.findOneByEmail(loginDto.email);
    
    // Kemungkinan pertama: user tidak ditemukan, tapi ini kecil kemungkinannya jika Anda menggunakan data seeder.
    // if (!user) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // 2. Bandingkan password yang dikirim dengan hash di database
    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    
    // INILAH YANG TERJADI:
    // `bcrypt.compare()` mengembalikan `false` karena password tidak cocok.
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials'); // <-- Error dilempar dari sini
    }

    // SOLUSI 2 & 3: Gunakan nama properti yang benar
    const payload = {
      sub: user.id_user,
      username: user.username,
      // role: user.role.nama_role, // Pastikan relasi 'role' non-nullable jika memang wajib
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}