import { User } from '../../users/entities/user.entity';
import { OrdersDetail } from '../../orders-details/entities/orders-detail.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'id_order', type: 'integer' })
  id: number;

  @CreateDateColumn({ name: 'order_date', type: 'timestamp with time zone' })
  orderDate: Date;

  @Column({ type: 'text' })
  address: string;

  @Column({ name: 'total_price', type: 'numeric', precision: 14, scale: 2 })
  totalPrice: number;

  @Column({ name: 'status_pengiriman', type: 'character varying', length: 50 })
  statusPengiriman: string;
  
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToMany(() => OrdersDetail, (detail) => detail.order)
  details: OrdersDetail[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;
}