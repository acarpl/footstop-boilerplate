import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.create(user, createOrderDto);
  }

  @Get()
  findAllForUser(@GetUser() user: User) {
    return this.ordersService.findAllForUser(user.id_user);
  }

  @Get(':id')
  findOneForUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.ordersService.findOneForUser(user.id_user, id);
  }
}