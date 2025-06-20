import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn({ name: 'id_cart', type: 'integer' })
  id: number;
  
  @Column({ type: 'character varying', length: 50 })
  size: string;
  
  @Column({ type: 'integer' })
  quantity: number;
  
  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Product, (product) => product.carts)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}