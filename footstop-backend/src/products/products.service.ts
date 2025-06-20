import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { productName, price, size, brandId, categoryId } = createProductDto;

    const brand = await this.brandRepository.findOneBy({ id: brandId });
    if (!brand) {
      throw new NotFoundException(`Brand dengan ID ${brandId} tidak ditemukan`);
    }

    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Kategori dengan ID ${categoryId} tidak ditemukan`);
    }

    const newProduct = this.productRepository.create({
      productName,
      price,
      size,
      brand, 
      category, 
    });

    return this.productRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: {
        brand: true,
        category: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // Gunakan preload untuk membuat objek Product dengan data update,
    // sambil memvalidasi bahwa produk dengan 'id' tersebut ada di DB.
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }

    // Jika DTO menyertakan brandId baru, cari dan lampirkan entitas Brand
    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOneBy({ id: updateProductDto.brandId });
      if (!brand) {
        throw new NotFoundException(`Brand dengan ID ${updateProductDto.brandId} tidak ditemukan`);
      }
      product.brand = brand;
    }

    // Jika DTO menyertakan categoryId baru, cari dan lampirkan entitas Category
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateProductDto.categoryId });
      if (!category) {
        throw new NotFoundException(`Kategori dengan ID ${updateProductDto.categoryId} tidak ditemukan`);
      }
      product.category = category;
    }

    // Simpan perubahan ke database
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<Product> {
    // Pertama, cari produk yang akan dihapus
    const productToRemove = await this.findOne(id);
    // findOne sudah menangani NotFoundException jika produk tidak ada

    // Jika ditemukan, hapus produk tersebut.
    // Metode .remove() akan mengembalikan objek yang baru saja dihapus.
    return this.productRepository.remove(productToRemove);
  }
}