import { Module } from '@nestjs/common';
import { GambarService } from './gambar.service';
import { GambarController } from './gambar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gambar } from './entities/gambar.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multer-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gambar]),
    MulterModule.register(multerOptions),
  ],
  controllers: [GambarController],
  providers: [GambarService],
})
export class GambarModule {}