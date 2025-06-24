import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])], // Pastikan ini ada!
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}