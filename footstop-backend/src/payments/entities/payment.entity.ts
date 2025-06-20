import { Order } from '../../orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id_payment', type: 'integer' })
  id: number;

  @Column({ name: 'payment_method', type: 'character varying', length: 50 })
  paymentMethod: string;

  @CreateDateColumn({ name: 'payment_date', type: 'timestamp with time zone' })
  paymentDate: Date;

  @Column({ name: 'payment_status', type: 'character varying', length: 50 })
  paymentStatus: string;
  
  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'id_order' })
  order: Order;
}