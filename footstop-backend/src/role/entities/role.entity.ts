import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role', type: 'integer' })
  id: number;

  @Column({ name: 'nama_role', type: 'character varying', length: 50 })
  namaRole: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}