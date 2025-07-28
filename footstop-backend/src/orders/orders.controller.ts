import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllForAdmin() { // Ganti Query() DTO jika perlu paginasi
      return this.ordersService.findAllForAdmin();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
      return this.ordersService.updateStatus(id, status);
  }
}