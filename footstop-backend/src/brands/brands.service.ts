import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async findOne(id: number): Promise<Brand> {
    // Menggunakan idBrand sesuai entity
    const brand = await this.brandRepository.findOneBy({ id_brand: id });
    if (!brand) {
      throw new NotFoundException(`Brand with ID #${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepository.preload({
      id_brand: id,
      ...updateBrandDto,
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID #${id} not found`);
    }
    return this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<Brand> {
    const brand = await this.findOne(id);
    return this.brandRepository.remove(brand);
  }
}