import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('gambar')
export class Gambar {
  @PrimaryGeneratedColumn()
  idGambar: number;

  @Column({ type: 'text' })
  url: string;

  // Relasi Many-to-One: Banyak gambar bisa dimiliki oleh satu produk
  // onDelete: 'CASCADE' berarti jika produk dihapus, semua gambarnya juga akan otomatis terhapus dari database.
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_product' }) // Kolom foreign key di tabel 'gambar'
  product: Product;
}