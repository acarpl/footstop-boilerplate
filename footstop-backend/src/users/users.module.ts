import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  // Baris ini adalah kunci.
  // Ia mendaftarkan User entity, yang memungkinkan TypeORM membuat UserRepository.
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Pastikan ini diekspor agar AuthModule bisa menggunakan UsersService
  exports: [UsersService],
})
export class UsersModule {}