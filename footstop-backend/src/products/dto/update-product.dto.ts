import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// UpdateProductDto akan mewarisi semua aturan validasi dari CreateProductDto,
export class UpdateProductDto extends PartialType(CreateProductDto) {}