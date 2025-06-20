import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { Gambar } from '../../gambar/entities/gambar.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { OrdersDetail } from '../../orders-details/entities/orders-detail.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id_product', type: 'integer' })
  id: number;

  @Column({ name: 'product_name', type: 'character varying', length: 255 })
  productName: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  size: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'id_brand' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'id_category' })
  category: Category;
  
  @OneToMany(() => Gambar, (gambar) => gambar.product)
  images: Gambar[];

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => OrdersDetail, (detail) => detail.product)
  orderDetails: OrdersDetail[];
}