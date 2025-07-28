// src/dashboard/dashboard.module.ts

import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Impor TypeOrmModule
import { Order } from '../orders/entities/order.entity'; // 2. Impor Order Entity
import { User } from '../users/entities/user.entity'; // 3. Impor User Entity

@Module({
  // 4. DAFTARKAN SEMUA ENTITY YANG DIGUNAKAN DI SINI
  imports: [TypeOrmModule.forFeature([Order, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}