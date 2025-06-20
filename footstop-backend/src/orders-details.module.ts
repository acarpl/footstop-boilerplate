import { Module } from '@nestjs/common';
import { OrdersDetailsService } from './orders-details.service';
import { OrdersDetailsController } from './orders-details.controller';

@Module({
  controllers: [OrdersDetailsController],
  providers: [OrdersDetailsService]
})
export class OrdersDetailsModule {}
