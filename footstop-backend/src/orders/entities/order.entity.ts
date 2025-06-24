import { User } from '../../users/entities/user.entity';
import { OrdersDetail } from '../../orders-details/entities/orders-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  idOrder: number;

  // Otomatis diisi saat order dibuat
  @CreateDateColumn({ type: 'timestamp with time zone' })
  orderDate: Date;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  statusPengiriman: string;

  // Relasi ke User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user: User;

  // Relasi ke OrdersDetail
  @OneToMany(() => OrdersDetail, (detail) => detail.order)
  orderDetails: OrdersDetail[];
}