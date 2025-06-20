import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GambarService } from './gambar.service';
import { CreateGambarDto } from './dto/create-gambar.dto';
import { UpdateGambarDto } from './dto/update-gambar.dto';

@Controller('gambar')
export class GambarController {
  constructor(private readonly gambarService: GambarService) {}

  @Post()
  create(@Body() createGambarDto: CreateGambarDto) {
    return this.gambarService.create(createGambarDto);
  }

  @Get()
  findAll() {
    return this.gambarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gambarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGambarDto: UpdateGambarDto) {
    return this.gambarService.update(+id, updateGambarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gambarService.remove(+id);
  }
}
