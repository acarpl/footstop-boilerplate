import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;
}