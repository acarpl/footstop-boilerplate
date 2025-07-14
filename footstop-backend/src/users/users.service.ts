import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable() // WAJIB
export class UsersService {
  usersRepository: any;
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userLikeObject: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(userLikeObject);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id_user: Number(id),
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id_user: id,
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    // Baris ini akan gagal jika this.userRepository adalah undefined
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      id_user: Number(id),
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }

    return this.usersRepository.save(user);
  }

  // src/users/users.service.ts

async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const saltRounds = 10;
  const hash = crypto.createHash('sha256'); // Create a hash object using the SHA-256 algorithm
  hash.update(refreshToken); // Update the hash object with the refresh token
  const hashedRefreshToken = hash.digest('hex'); // Get the hashed refresh token as a hexadecimal string

  // ...
}

  /**
   * Menghapus (nullify) refresh token hash dari database.
   * Dipanggil saat logout.
   * @param userId - ID pengguna.
   */
  async removeRefreshToken(userId: number): Promise<void> {
    // Metode ini juga bisa diubah ke Query Builder untuk konsistensi
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshTokenHash: null })
      .where("id_user = :id", { id: userId })
      .execute();
  }


  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
