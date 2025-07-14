import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GambarService } from './gambar.service';
import { CreateGambarDto } from './dto/create-gambar.dto';

@Controller('gambar')
export class GambarController {
  constructor(private readonly gambarService: GambarService) {}

  // === [POST] Upload gambar (user / product) ===
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_product') id_product: number,
    @Body('id_user') id_user: number,
  ) {
    if (!file) {
      throw new BadRequestException('File gambar tidak ditemukan');
    }

    if (!id_product && !id_user) {
      throw new BadRequestException('id_user atau id_product harus diisi');
    }

    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;

    const dto: CreateGambarDto = {
      url: fileUrl,
      id_user: id_user ? +id_user : undefined,
      id_product: id_product ? +id_product : undefined,
    };

    return this.gambarService.create(dto);
  }

  // === [GET] Semua gambar milik user tertentu ===
  @Get('user/:id_user')
  async getGambarUser(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.gambarService.findByUser(id_user);
  }

  // === [GET] Semua gambar milik produk tertentu ===
  @Get('product/:id_product')
  async getGambarProduct(@Param('id_product', ParseIntPipe) id_product: number) {
    return this.gambarService.findByProduct(id_product);
  }

  // === [DELETE] Hapus gambar by ID ===
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.gambarService.remove(id);
  }
}
