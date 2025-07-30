import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- AMANKAN
  @Roles('admin') // <-- HANYA ADMIN
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

    @Get('admin/all') // <-- RUTE YANG ANDA BUTUHKAN
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(5), new ParseIntPipe()) limit: number,
  ) {
    // Pastikan Anda juga memiliki metode findAllForAdmin di ProductsService
    return this.productsService.findAllForAdmin({ page, limit });
  }

  // Endpoint GET ini publik, jadi tidak perlu diamankan
  @Get()
  findAll(@Query() queryProductDto: QueryProductDto) {
    return this.productsService.findAll(queryProductDto);
  }

  // Endpoint GET by ID ini juga publik
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- AMANKAN
  @Roles('admin') // <-- HANYA ADMIN
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- AMANKAN
  @Roles('admin') // <-- HANYA ADMIN
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}