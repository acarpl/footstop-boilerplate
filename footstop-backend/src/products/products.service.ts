import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { id_brand, id_category, ...productData } = createProductDto;

    // TypeORM cukup pintar untuk menangani ini.
    // Kita buat objek baru dengan struktur yang dikenali oleh entity Product.
    const product = this.productRepository.create({
      ...productData,
      brand: { id_brand: id_brand },
      category: { id_category: id_category },
    });

    return this.productRepository.save(product);
  }

  async findAll(queryDto: QueryProductDto) {
    const {
      page = 1,
      limit = 10,
      search,
      idCategory,
      idBrand,
    } = queryDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // 2. Lakukan JOIN ke relasi agar bisa memfilter dan menampilkan datanya
    // Kita gunakan leftJoinAndSelect agar data brand dan category ikut di dalam hasil
    queryBuilder.leftJoinAndSelect('product.brand', 'brand');
    queryBuilder.leftJoinAndSelect('product.category', 'category');

    // 3. Tambahkan kondisi WHERE secara dinamis
    if (search) {
      // Mencari di nama produk DAN nama brand secara case-insensitive
      queryBuilder.andWhere(
        '(product.productName ILIKE :search OR brand.brandName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (idCategory) {
      queryBuilder.andWhere('product.category.id_category = :idCategory', {
        idCategory,
      });
    }

    if (idBrand) {
      queryBuilder.andWhere('product.brand.id_brand = :idBrand', { idBrand });
    }

    // 4. Atur paginasi
    queryBuilder.skip((page - 1) * limit).take(limit);

    // 5. Eksekusi query dan dapatkan hasil serta total data
    const [data, total] = await queryBuilder.getManyAndCount();

    // 6. Kembalikan hasil dalam format yang informatif
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
  
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id_product: id });
    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { id_brand, id_category, ...productData } = updateProductDto;

    const updatePayload: any = { ...productData };
    if (id_brand) {
      updatePayload.brand = { id_brand };
    }
    if (id_category) {
      updatePayload.category = { id_category };
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