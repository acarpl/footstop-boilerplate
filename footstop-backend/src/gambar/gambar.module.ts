import { Module } from '@nestjs/common';
import { GambarService } from './gambar.service';
import { GambarController } from './gambar.controller';

@Module({
  controllers: [GambarController],
  providers: [GambarService]
})
export class GambarModule {}
