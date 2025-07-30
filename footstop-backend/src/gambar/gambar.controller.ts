// src/gambar/gambar.controller.ts

import { Controller, Post, Body, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GambarService } from './gambar.service';

@Controller('gambar')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Proteksi semua endpoint di controller ini
export class GambarController {
  constructor(private readonly gambarService: GambarService) {}

  @Post('upload')
  @Roles('admin') // Hanya admin yang bisa upload
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('idProduct', ParseIntPipe) id_product: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const fileUrl = `http://localhost:3001/uploads/${file.filename}`; // Sesuaikan port jika perlu
    return this.gambarService.create({
      url: fileUrl, id_product,
      id_user: 0
    });
  }

  @Delete(':id')
  @Roles('admin') // Hanya admin yang bisa hapus
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gambarService.remove(id);
  }
}