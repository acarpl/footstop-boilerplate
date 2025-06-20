import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('gambar')
export class Gambar {
@PrimaryGeneratedColumn({ name: 'id_gambar', type: 'integer' })
id: number;
@Column({ type: 'text' })
url: string;
@ManyToOne(() => Product, (product) => product.images)
@JoinColumn({ name: 'id_product' })
product: Product;
}