import { PartialType } from '@nestjs/swagger';
import { CreateOrdersDetailDto } from './create-orders-detail.dto';

export class UpdateOrdersDetailDto extends PartialType(CreateOrdersDetailDto) {}
