import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const result = await this.usersRepository.insert(createUserDto as any);
    return this.usersRepository.findOneBy({ id_user: result.identifiers[0].id });
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

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
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
