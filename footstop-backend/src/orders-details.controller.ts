import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersDetailsService } from './orders-details.service';
import { CreateOrdersDetailDto } from './dto/create-orders-detail.dto';
import { UpdateOrdersDetailDto } from './dto/update-orders-detail.dto';

@Controller('orders-details')
export class OrdersDetailsController {
  constructor(private readonly ordersDetailsService: OrdersDetailsService) {}

  @Post()
  create(@Body() createOrdersDetailDto: CreateOrdersDetailDto) {
    return this.ordersDetailsService.create(createOrdersDetailDto);
  }

  @Get()
  findAll() {
    return this.ordersDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdersDetailDto: UpdateOrdersDetailDto) {
    return this.ordersDetailsService.update(+id, updateOrdersDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersDetailsService.remove(+id);
  }
}
