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

/**
 * Merepresentasikan sebuah pesanan (order) di dalam database.
 */
@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id_order: number;

  /**
   * Tanggal dan waktu saat pesanan dibuat.
   * Diisi secara otomatis oleh database.
   */
  @CreateDateColumn({ name: "order_date", type: "timestamp with time zone" })
  orderDate: Date;

  /**
   * Alamat lengkap pengiriman untuk pesanan ini.
   */
  @Column({ type: "text" })
  address: string;

  /**
   * Nama lengkap penerima pesanan.
   */
  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName: string;

  /**
   * Nomor telepon penerima pesanan.
   */
  @Column({ name: "phone_number", type: "varchar", length: 50, nullable: true })
  phoneNumber: string;

  /**
   * Total harga akhir dari semua item dalam pesanan.
   */
  @Column({ name: "total_price", type: "numeric", precision: 14, scale: 2 })
  totalPrice: number;

  /**
   * Status pengiriman pesanan saat ini (e.g., 'Pending', 'Dibayar', 'Dikirim').
   */
  @Column({
    name: "status_pengiriman",
    type: "varchar",
    length: 50,
    default: "Pending",
  })
  statusPengiriman: string;

  // --- Relasi ---

  /**
   * Relasi Many-to-One: Setiap pesanan dimiliki oleh satu pengguna.
   * Kolom foreign key 'id_user' ada di tabel ini.
   */
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "id_user" })
  user: User;

  /**
   * Relasi One-to-Many: Setiap pesanan memiliki banyak item detail.
   */
  @OneToMany(() => OrdersDetail, (detail) => detail.order)
  orderDetails: OrdersDetail[];
}
