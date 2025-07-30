import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGambarDto } from './dto/create-gambar.dto';
import { Gambar } from './entities/gambar.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class GambarService {
// Untuk ambil semua gambar user
  async findByUser(id_user: number): Promise<Gambar[]> {
    return this.gambarRepository.find({
      where: { user: { id_user } },
      relations: ['user'],
    });
  }

  // Untuk ambil semua gambar produk
  async findByProduct(id_product: number): Promise<Gambar[]> {
    return this.gambarRepository.find({
      where: { product: { id_product } },
      relations: ['product'],
    });
  }

  constructor(
    @InjectRepository(Gambar)
    private readonly gambarRepository: Repository<Gambar>,
  ) {}

  async create(dto: CreateGambarDto): Promise<Gambar> {
    const gambar = this.gambarRepository.create({
      url: dto.url,
      user: dto.id_user ? { id_user: dto.id_user } : undefined,
      product: dto.id_product ? { id_product: dto.id_product } : undefined,
    });

    return this.gambarRepository.save(gambar);
  }

  async findOne(id: number): Promise<Gambar> {
    const gambar = await this.gambarRepository.findOne({
      where: { id_gambar: id },
      relations: ['user', 'product'], // penting jika King ingin akses detail relasi
    });

    if (!gambar) {
      throw new NotFoundException(`Image with ID #${id} not found`);
    }
    return gambar;
  }

  async remove(id: number): Promise<void> {
    const gambar = await this.gambarRepository.findOneBy({ id_gambar: id });
    if (!gambar) {
      throw new NotFoundException(`Image with ID #${id} not found`);
    }

    try {
      // Hapus file fisik dari folder 'uploads'
      const filename = gambar.url.split('/uploads/')[1];
      unlink(join(process.cwd(), 'uploads', filename));
    } catch (error) {
      console.error("Failed to delete physical file:", error.message);
      // Tetap lanjutkan untuk menghapus dari DB meskipun file fisik tidak ada
    }

    // Hapus record dari database
    await this.gambarRepository.remove(gambar);
  }
}
