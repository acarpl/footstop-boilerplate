import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { Gambar } from '../../gambar/entities/gambar.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column({ type: 'varchar', length: 255 })
  product_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  // --- RELASI Many-to-One ---

  // Relasi ke Brand
  @ManyToOne(() => Brand, (brand) => brand.products, { eager: true }) // eager: true akan otomatis join saat find
  @JoinColumn({ name: 'id_brand' }) // Menentukan kolom foreign key di tabel 'products'
  brand: Brand;

  // Relasi ke Category
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'id_category' })
  category: Category;

  // --- RELASI One-to-Many ---
  // Satu produk bisa punya banyak gambar
  @OneToMany(() => Gambar, (gambar) => gambar.product)
  images: Gambar[];
}