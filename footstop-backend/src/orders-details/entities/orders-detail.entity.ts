import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orders_details')
export class OrdersDetail {
  @PrimaryGeneratedColumn()
  idOrderDetails: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  pricePerUnit: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  subtotal: number;
  
  @Column({ type: 'varchar', length: 50, nullable: true })
  size: string;

  // Relasi ke Order
  @ManyToOne(() => Order, (order) => order.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order: Order;

  // Relasi ke Product
  @ManyToOne(() => Product, { eager: true }) // eager agar detail produk ikut
  @JoinColumn({ name: 'id_product' })
  product: Product;
}