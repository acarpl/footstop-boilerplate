import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Order } from "./entities/order.entity";
import { OrdersDetail } from "../orders-details/entities/orders-detail.entity";
import { Cart } from "../carts/entities/cart.entity";

@Module({
  // Pastikan hanya mengimpor TypeOrmModule untuk semua entity yang dibutuhkan
  imports: [TypeOrmModule.forFeature([Order, OrdersDetail, Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
