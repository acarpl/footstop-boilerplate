import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [
    // Daftarkan SEMUA entitas yang disentuh oleh seeder di sini
    TypeOrmModule.forFeature([User, Role, Address]),
  ],
  providers: [SeederService],
})
export class SeederModule {}