import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  // Inject repository agar bisa berinteraksi dengan database
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ idCategory: id });
    if (!category) {
      throw new NotFoundException(`Category with ID #${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.preload({
      idCategory: id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID #${id} not found`);
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<Category> {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}