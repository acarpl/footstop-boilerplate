import { Order } from '../../orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id_payment: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  // Otomatis diisi saat pembayaran dicatat
  @CreateDateColumn({ type: 'timestamp with time zone' })
  payment_date: Date;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  payment_status: string;

  // Relasi One-to-One: Satu pesanan hanya punya satu pembayaran yang berhasil
  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order: Order;
}