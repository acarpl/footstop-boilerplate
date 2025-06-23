import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nama_role: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}