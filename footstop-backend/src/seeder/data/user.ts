import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { Address } from '../../address/entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable} from '@nestjs/common';
import { DeepPartial } from 'typeorm'; 


class Seeder {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
private async seedUsers() {
  // 1. Definisikan data mentah Anda (pastikan property name benar!)
  const userMasterData = [
  {
    username: 'admin',
    password: await bcrypt.hash('password123', 10),
    email: 'admin@example.com',
    phone_number: '1234567890',
    role: { id: 1 } as DeepPartial<Role>,
    address: { id: 1 } as DeepPartial<Address>,
  },
  {
    username: 'customer1',
    password: await bcrypt.hash('password123', 10),
    email: 'customer1@example.com',
    phone_number: '0987654321',
    role: { id: 2 } as DeepPartial<Role>,
    address: { id: 2 } as DeepPartial<Address>,
  },
];

  // 2. Gunakan .create() untuk mengubah objek mentah menjadi instance User
  // Metode .create() cukup pintar untuk menangani relasi
  const userEntities = this.usersRepository.create(userMasterData);

  // 3. Simpan array dari entity tersebut ke database
  // .save() akan melakukan INSERT karena entity ini belum punya ID
  await this.usersRepository.save(userEntities);
  
  console.log('Users seeded successfully');
}
}