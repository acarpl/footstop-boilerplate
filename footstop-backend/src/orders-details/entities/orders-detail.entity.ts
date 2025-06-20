import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orders_details')
export class OrdersDetail {
  @PrimaryGeneratedColumn({ name: 'id_order_details', type: 'integer' })
  id: number;
  
  @Column({ type: 'integer' })
  quantity: number;

  @Column({ name: 'price_per_unit', type: 'numeric', precision: 12, scale: 2 })
  pricePerUnit: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  subtotal: number;
  
  @Column({ type: 'character varying', length: 50 })
  size: string;
  
  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}