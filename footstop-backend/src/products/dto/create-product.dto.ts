import { 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsNumber, 
  IsPositive, 
  IsOptional, 
  IsInt
} from 'class-validator';

// Kita menggunakan 'class-validator' untuk menambahkan aturan validasi.
// Pastikan sudah terinstal: npm install class-validator class-transformer

export class CreateProductDto {
  
  @IsString({ message: 'Nama produk harus berupa teks' })
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  @MinLength(5, { message: 'Nama produk minimal harus 5 karakter' })
  productName: string;

  @IsOptional() // Size boleh kosong
  @IsString()
  size: string;

  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @IsPositive({ message: 'Harga harus bernilai positif' })
  price: number;

  @IsInt({ message: 'ID Brand harus berupa angka (integer)' })
  @IsNotEmpty({ message: 'Brand harus diisi' })
  brandId: number; // Klien akan mengirimkan ID dari brand, bukan objek brand

  @IsInt({ message: 'ID Kategori harus berupa angka (integer)' })
  @IsNotEmpty({ message: 'Kategori harus diisi' })
  categoryId: number; // Klien akan mengirimkan ID dari kategori
}