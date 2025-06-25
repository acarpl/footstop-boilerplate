import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGambarDto } from './dto/create-gambar.dto';
import { Gambar } from './entities/gambar.entity';

@Injectable()
export class GambarService {
  constructor(
    @InjectRepository(Gambar)
    private readonly gambarRepository: Repository<Gambar>,
  ) {}

  async create(createGambarDto: CreateGambarDto): Promise<Gambar> {
    const { id_product, url } = createGambarDto;
    
    // TODO: Verifikasi apakah produk dengan idProduct ada sebelum menyimpan

    const gambar = this.gambarRepository.create({
      url,
      product: { id_product: id_product },
    });
    return this.gambarRepository.save(gambar);
  }

  async findOne(id: number): Promise<Gambar> {
    const gambar = await this.gambarRepository.findOneBy({ id_gambar: id });
    if (!gambar) {
      throw new NotFoundException(`Image with ID #${id} not found`);
    }
    return gambar;
  }

  async remove(id: number): Promise<Gambar> {
    // TODO: Hapus juga file fisik dari folder /uploads
    const gambar = await this.findOne(id);
    return this.gambarRepository.remove(gambar);
  }
}