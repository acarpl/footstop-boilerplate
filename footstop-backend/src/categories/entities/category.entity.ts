import { Product } from '../../products/entities/product.entity'; // Kita akan buat ini nanti
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  idCategory: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  categoryName: string;

  // Satu kategori bisa memiliki banyak produk
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}