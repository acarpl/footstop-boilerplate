import { Injectable } from '@nestjs/common';
import { CreateGambarDto } from './dto/create-gambar.dto';
import { UpdateGambarDto } from './dto/update-gambar.dto';

@Injectable()
export class GambarService {
  create(createGambarDto: CreateGambarDto) {
    return 'This action adds a new gambar';
  }

  findAll() {
    return `This action returns all gambar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gambar`;
  }

  update(id: number, updateGambarDto: UpdateGambarDto) {
    return `This action updates a #${id} gambar`;
  }

  remove(id: number) {
    return `This action removes a #${id} gambar`;
  }
}
