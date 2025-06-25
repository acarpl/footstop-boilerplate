import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('gambar')
export class Gambar {
  @PrimaryGeneratedColumn()
  id_gambar: number;

  @Column({ type: 'text' })
  url: string;
  
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_product' }) // Kolom foreign key di tabel 'gambar'
  product: Product;
}