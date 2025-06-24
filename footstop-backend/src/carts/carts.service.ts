import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  // FIX: Change parameter name for clarity
  async addItemToCart(id_user: number, createCartDto: CreateCartDto): Promise<Cart> {
    const { idProduct, quantity, size } = createCartDto;

    const existingCartItem = await this.cartRepository.findOne({
      where: {
        // FIX: Use the correct property name
        user: { id_user },
        product: { idProduct }, // Assuming 'idProduct' is correct in Product entity
        size: size,
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return this.cartRepository.save(existingCartItem);
    } else {
      const newCartItem = this.cartRepository.create({
        // FIX: Use the correct property name
        user: { id_user },
        product: { idProduct },
        quantity,
        size,
      });
      return this.cartRepository.save(newCartItem);
    }
  }

  // FIX: Change parameter name
  findAllForUser(id_user: number): Promise<Cart[]> {
    return this.cartRepository.find({
      // FIX: Use the correct property name
      where: { user: { id_user } },
    });
  }

  // FIX: Change parameter name
  async updateItemQuantity(id_user: number, idCart: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    // FIX: Use the correct property name
    const cartItem = await this.cartRepository.findOneBy({ idCart, user: { id_user }});
    // ... (rest of the function is ok)
    if (!cartItem) {
        throw new NotFoundException(`Cart item with ID #${idCart} not found for this user.`);
    }
    cartItem.quantity = updateCartDto.quantity;
    return this.cartRepository.save(cartItem);
  }

  // FIX: Change parameter name
  async removeItemFromCart(id_user: number, idCart: number): Promise<void> {
    // FIX: Use the correct property name
    const result = await this.cartRepository.delete({ idCart, user: { id_user } });
    // ... (rest of the function is ok)
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID #${idCart} not found for this user.`);
    }
  }
}