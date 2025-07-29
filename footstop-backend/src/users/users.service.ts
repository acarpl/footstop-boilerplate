import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable() // WAJIB
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userLikeObject: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(userLikeObject);
    return this.usersRepository.save(user);
  }

  usersRepository: any;

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id_user: Number(id),
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

   async findOneById(id_user: number): Promise<User | undefined> {
    // Akan crash jika this.userRepository adalah undefined
    return this.userRepository.findOneBy({ id_user });
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

  async update(id_user: number, updateUserDto: any): Promise<User> {
    // 1. Pisahkan ID relasi dari data utama
    const { id_role, ...userData } = updateUserDto;

    // 2. Siapkan payload untuk preload.
    // Inisialisasi dengan data non-relasi.
    const preloadPayload: any = {
      id_user: id_user,
      ...userData,
    };

    // 3. Jika id_role dikirim, format dengan benar untuk relasi.
    if (id_role) {
      preloadPayload.role = { id_role: id_role };
    }

    // 4. Gunakan payload yang sudah diformat dengan benar.
    const user = await this.userRepository.preload(preloadPayload);

    if (!user) {
      throw new NotFoundException(`User with ID #${id_user} not found.`);
    }

    return this.userRepository.save(user);
  }

  // src/users/users.service.ts

async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const saltRounds = 10;
  const hash = crypto.createHash('sha256'); // Create a hash object using the SHA-256 algorithm
  hash.update(refreshToken); // Update the hash object with the refresh token
  const hashedRefreshToken = hash.digest('hex'); // Get the hashed refresh token as a hexadecimal string

  // ...
}

async findAllPaginated({ page, limit }: { page: number; limit: number }) {
  const skip = (page - 1) * limit;
  const users = await this.userRepository.find({
    skip,
    take: limit,
  });
  const totalCount = await this.userRepository.count();
  return {
    data: users,
    meta: {
      page,
      limit,
      totalCount,
      relations: ['role', 'address'],
    },
  };
}
  async remove(id_user: number): Promise<void> {
    const result = await this.userRepository.delete(id_user);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID #${id_user} not found.`);
    }
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
}
