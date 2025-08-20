import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Membuat user baru, otomatis hash password.
   */
async create(userLikeObject: DeepPartial<User>): Promise<User> {

  const existing = await this.userRepository.findOneBy({ email: userLikeObject.email });
  if (existing) throw new BadRequestException('Email is already in use.');

  if (!userLikeObject.id_role) userLikeObject.id_role = 1; // 1 = customer

  if (!userLikeObject.phone_number) {
    throw new BadRequestException('phone_number is required');
  }

    if (!userLikeObject.role) {
    userLikeObject.role = { id_role: 1 }; // default customer
  }

  if (userLikeObject.password) {
    userLikeObject.password = await bcrypt.hash(userLikeObject.password, 10);
  }

  const user = this.userRepository.create(userLikeObject);
  return this.userRepository.save(user);
}


async findOneById(id_user: number): Promise<User | undefined> {
  return this.userRepository.findOne({
    where: { id_user },
    relations: ['role'], // supaya role ikut
  });
}


  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * Update user (termasuk relasi role jika dikirim)
   */
async update(id_user: number, updateUserDto: UpdateUserDto | AdminUpdateUserDto): Promise<User> {
  // Hanya preload user data dari DTO
  const preloadPayload: any = { id_user, ...updateUserDto };

  // Jika adminUpdateUserDto dan ada id_role, set role
  if ('id_role' in updateUserDto && updateUserDto.id_role) {
    preloadPayload.role = { id_role: updateUserDto.id_role };
  }

  const user = await this.userRepository.preload(preloadPayload);
  if (!user) throw new NotFoundException(`User with ID #${id_user} not found.`);

  return this.userRepository.save(user);
}


  /**
   * Update refresh token hash menggunakan bcrypt
   */
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshTokenHash: hashed } as any);
  }

  /**
   * Menghapus refresh token hash saat logout
   */
  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshTokenHash: null });
  }

  async remove(id_user: number): Promise<void> {
    const result = await this.userRepository.delete(id_user);
    if (result.affected === 0) throw new NotFoundException(`User with ID #${id_user} not found.`);
  }

  async findAllPaginated({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const users = await this.userRepository.find({
      skip,
      take: limit,
      relations: ['role'], // relasi role
    });
    const totalCount = await this.userRepository.count();
    return {
      data: users,
      meta: { page, limit, totalCount, relations: ['role', 'address'] },
    };
  }
}
