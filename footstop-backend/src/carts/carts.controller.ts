import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('carts')
@UseGuards(AuthGuard('jwt')) // Melindungi SEMUA endpoint di controller ini
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  addItemToCart(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User
  ) {
    return this.cartsService.addItemToCart(user.id_user, createCartDto);
  }

  @Get()
  findAllForUser(@GetUser() user: User) {
    return this.cartsService.findAllForUser(user.id_user);
  }
  
  @Get(':id')
  findOneForUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    return this.cartsService.findOneForUser(user.id_user, id);
  }

  @Patch(':id')
  updateItemQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() user: User
  ) {
    return this.cartsService.updateItemQuantity(user.id_user, id, updateCartDto);
  }

  @Delete(':id')
  removeItemFromCart(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    return this.cartsService.removeItemFromCart(user.id_user, id);
  }
}