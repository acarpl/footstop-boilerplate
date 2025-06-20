import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    // Mengambil data beserta relasinya (brand dan category)
    return this.productsRepository.find({ relations: ['brand', 'category'] });
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id }, relations: ['brand', 'category'] });
  }

  // ... fungsi update dan remove
}