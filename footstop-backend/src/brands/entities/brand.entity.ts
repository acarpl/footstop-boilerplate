import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn({ name: 'id_brand', type: 'integer' })
  id: number;

  @Column({ name: 'brand_name', type: 'character varying', length: 100 })
  brandName: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}