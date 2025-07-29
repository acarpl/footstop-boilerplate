import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Patch, DefaultValuePipe, Query } from '@nestjs/common';
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

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.ordersService.findAllForAdmin({ page, limit });
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOneForAdmin(@Param('id', ParseIntPipe) id: number) {
      return this.ordersService.findOneForAdmin(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}