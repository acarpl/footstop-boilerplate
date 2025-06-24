import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  idBrand: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  brandName: string;

  // Mendefinisikan hubungan: Satu merek bisa memiliki banyak produk
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}