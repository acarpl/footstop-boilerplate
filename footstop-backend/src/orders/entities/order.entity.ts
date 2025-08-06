import { User } from "../../users/entities/user.entity";
import { OrdersDetail } from "../../orders-details/entities/orders-detail.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id_order: number;

  // Otomatis diisi saat order dibuat
  @CreateDateColumn({ type: "timestamp with time zone" })
  order_date: Date;

  @Column({ type: "text" })
  address: string;

  @Column({ type: "numeric", precision: 14, scale: 2 })
  total_price: number;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  status_pengiriman: string;

  // Relasi ke User
  @ManyToOne(() => User)
  @JoinColumn({ name: "id_user" })
  user: User;

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName: string;

  @Column({ name: "phone_number", type: "varchar", length: 50, nullable: true })
  phoneNumber: string;

  // Relasi ke OrdersDetail
  @OneToMany(() => OrdersDetail, (detail) => detail.order)
  orderDetails: OrdersDetail[];
}
