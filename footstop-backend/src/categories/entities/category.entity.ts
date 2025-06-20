import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id_category', type: 'integer' })
  id: number;

  @Column({ name: 'category_name', type: 'character varying', length: 100 })
  categoryName: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}