import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { QueryProductDto } from "./dto/query-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  // PASTIKAN METODE INI ADA
  async findAllForAdmin(options: { page: number; limit: number }) {
    const { page, limit } = options;
    const [data, total] = await this.productRepository.findAndCount({
      relations: ["brand", "category", "images"], // Pastikan semua relasi ada
      order: { id_product: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, lastPage: Math.ceil(total / limit) };
  }

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
    const { page = 1, limit = 10, search, id_category, id_brand } = queryDto;

    const queryBuilder = this.productRepository.createQueryBuilder("product");

    // 2. Lakukan JOIN ke relasi agar bisa memfilter dan menampilkan datanya
    // Kita gunakan leftJoinAndSelect agar data brand dan category ikut di dalam hasil
    queryBuilder.leftJoinAndSelect("product.brand", "brand");
    queryBuilder.leftJoinAndSelect("product.category", "category");
    queryBuilder.leftJoinAndSelect("product.images", "images");

    // 3. Tambahkan kondisi WHERE secara dinamis
    if (search) {
      // Mencari di nama produk DAN nama brand secara case-insensitive
      queryBuilder.andWhere(
        "(product.productName ILIKE :search OR brand.brandName ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (id_category) {
      queryBuilder.andWhere("product.category.id_category = :id_category", {
        id_category,
      });
    }

    if (id_brand) {
      queryBuilder.andWhere("product.brand.id_brand = :id_brand", { id_brand });
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
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      // Pastikan relasi ini dimuat!
      relations: ["brand", "category", "images"],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    // 1. Ambil ID relasi dari DTO
    const { id_brand, id_category, ...productData } = updateProductDto;

    // 2. Siapkan payload dasar untuk preload dengan data non-relasi
    const preloadPayload: any = {
      id_product: id,
      ...productData,
    };

    // 3. Jika ID brand dikirim, format dengan benar untuk relasi
    if (id_brand) {
      preloadPayload.brand = { id_brand: id_brand };
    }

    // 4. Jika ID kategori dikirim, format dengan benar untuk relasi
    if (id_category) {
      preloadPayload.category = { id_category: id_category };
    }

    // Log untuk debugging, Anda bisa menghapusnya nanti
    console.log("Payload for preload:", preloadPayload);

    // 5. Panggil preload dengan payload yang sudah bersih dan terstruktur
    const product = await this.productRepository.preload(preloadPayload);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}
