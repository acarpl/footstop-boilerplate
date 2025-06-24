import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersDetail } from '../orders-details/entities/orders-detail.entity';
import { Cart } from '../carts/entities/cart.entity';

@Module({
  // Impor semua entity yang dibutuhkan oleh service
  imports: [TypeOrmModule.forFeature([Order, OrdersDetail, Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}