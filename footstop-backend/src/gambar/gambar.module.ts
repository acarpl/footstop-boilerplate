import { Module } from '@nestjs/common';
import { GambarService } from './gambar.service';
import { GambarController } from './gambar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gambar } from './entities/gambar.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gambar]),
    // Konfigurasi Multer: file yang di-upload akan disimpan di folder 'uploads'
    MulterModule.register({
      dest: './uploads', // Folder tujuan penyimpanan file
    }),
  ],
  controllers: [GambarController],
  providers: [GambarService],
})
export class GambarModule {}