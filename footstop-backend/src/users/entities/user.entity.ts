import { Role } from '../../role/entities/role.entity';
import { Address } from '../../address/entities/address.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user', type: 'integer' })
  id: number;

  @Column({ type: 'character varying', length: 50, unique: true })
  username: string;

  @Column({ type: 'character varying', length: 255, select: false }) // select: false agar password tidak ikut terambil saat query
  password: string;

  @Column({ type: 'character varying', length: 100, unique: true })
  email: string;

  @Column({ name: 'phone_number', type: 'character varying', length: 20, nullable: true })
  phoneNumber: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true }) // eager: true agar role otomatis ter-load saat query user
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @ManyToOne(() => Address, (address) => address.users, { nullable: true })
  @JoinColumn({ name: 'id_address' })
  address: Address;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}