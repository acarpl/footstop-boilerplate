import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { TypeOrmModule } from "@nestjs/typeorm"; // 1. Impor TypeOrmModule
import { Order } from "../orders/entities/order.entity"; // 2. Impor Order Entity
// Jika Anda membutuhkan User entity di sini, impor juga
// import { User } from '../users/entities/user.entity';

@Module({
  // 3. DAFTARKAN SEMUA ENTITY YANG DIBUTUHKAN SERVICE DI SINI
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
