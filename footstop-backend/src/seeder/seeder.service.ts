import { Injectable } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/entities/role.entity';
import { Address } from '../address/entities/address.entity';
import { User } from '../users/entities/user.entity';

class Seeder {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async seedUsers() { }}
@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Metode utama yang akan dipanggil
  async seed() {
    // 1. Seed entitas yang tidak punya dependensi terlebih dahulu
    await this.seedRoles();
    await this.seedAddresses();
    
    // 2. Baru seed entitas yang punya dependensi (User)
    await this.seedUsers();

    console.log('Seeding complete!');
  }

  private async seedRoles() {
    const roles = this.roleRepository.create([
        { id_role: 1, nama_role: 'admin' },
        { id_role: 2, nama_role: 'customer' },
    ]);
    await this.roleRepository.save(roles);
  }

  private async seedAddresses() {
  const addresses = this.addressRepository.create([
    { id: 1, nameAddress: 'Alamat Admin Utama' },
    { id: 2, nameAddress: 'Alamat Customer 1' },
  ]);
  await this.addressRepository.save(addresses);
}

  // Fungsi seedUsers Anda (sudah benar)
  private async seedUsers() {
  const userMasterData = [
    {
      username: 'admin',
      // Add other properties as needed
    },
    {
      username: 'customer1',
      // Add other properties as needed
    },
  ];
  const userEntities = this.usersRepository.create(userMasterData);
  await this.usersRepository.save(userEntities);
}
}
