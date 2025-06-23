import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return role;
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id_role: id });
    if (!role) {
      throw new NotFoundException(`Role with ID #${id} not found`);
    } else {
      return role;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.preload({
      id_role: id,
      ...updateRoleDto,
    });
    if (!role) {
      throw new NotFoundException(`Role with ID #${id} not found`);
    }
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<Role> {
    const role = await this.findOne(id);
    return this.roleRepository.remove(role);
  }
}
