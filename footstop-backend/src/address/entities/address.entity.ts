import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ name: 'id_address', type: 'integer' })
  id: number;

  @Column({ name: 'name_address', type: 'text' })
  nameAddress: string;

  @OneToMany(() => User, (user) => user.address)
  users: User[];
}