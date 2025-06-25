import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
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
    const user = await this.usersRepository.findOneBy({ id_user: Number(id) });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id_user: id });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    // Gunakan query builder untuk secara eksplisit menambahkan kolom 'password'
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // <-- TAMBAHKAN BARIS INI
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

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
