import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  idCart: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size: string;

  // Relasi ke User
  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  // Relasi ke Product
  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true }) // eager agar detail produk ikut saat find
  @JoinColumn({ name: 'id_product' })
  product: Product;
}