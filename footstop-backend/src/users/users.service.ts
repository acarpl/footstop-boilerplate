import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  userRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // menambahkan password yang by default tidak ikut di-select
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.role', 'role')
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
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);
    
    // Baris ini sekarang seharusnya berfungsi karena this.userRepository tidak lagi undefined
    await this.userRepository 
      .createQueryBuilder()
      .update(User)
      .set({ refreshTokenHash: hashedRefreshToken })
      .where("id_user = :id", { id: userId })
      .execute();
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
