import { Controller, Post, Body, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GambarService } from './gambar.service';

@Controller('gambar')
export class GambarController {
  constructor(private readonly gambarService: GambarService) {}

  // Endpoint utama untuk upload gambar
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' adalah nama field di form-data
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_product', ParseIntPipe) id_product: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Buat URL lengkap untuk mengakses file
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;

    return this.gambarService.create({
      url: fileUrl,
      id_product: id_product,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gambarService.remove(id);
  }
}