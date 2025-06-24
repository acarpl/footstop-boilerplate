import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { idBrand, idCategory, ...productData } = createProductDto;

    // TypeORM cukup pintar untuk menangani ini.
    // Kita buat objek baru dengan struktur yang dikenali oleh entity Product.
    const product = this.productRepository.create({
      ...productData,
      brand: { idBrand: idBrand },
      category: { idCategory: idCategory },
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    // Karena kita menggunakan eager: true di entity, relasi brand dan category akan otomatis ikut.
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ idProduct: id });
    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { idBrand, idCategory, ...productData } = updateProductDto;

    const updatePayload: any = { ...productData };
    if (idBrand) {
      updatePayload.brand = { idBrand };
    }
    if (idCategory) {
      updatePayload.category = { idCategory };
    }

    const product = await this.productRepository.preload({
      idProduct: id,
      ...updatePayload,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}