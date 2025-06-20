import { PartialType } from '@nestjs/swagger';
import { CreateGambarDto } from './create-gambar.dto';

export class UpdateGambarDto extends PartialType(CreateGambarDto) {}
