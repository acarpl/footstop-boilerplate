// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressModule } from './address/address.module';
import { GambarModule } from './gambar/gambar.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { OrdersDetailsModule } from './orders-details/orders-details.module';
// Import module lain akan ditambahkan di sini nanti

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Membuat ConfigService tersedia di seluruh aplikasi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Otomatis memuat semua file entity
        synchronize: false, // PENTING: false karena database Anda sudah ada
      }),
    }),
    RoleModule,
    BrandsModule,
    CategoriesModule,
    AddressModule,
    GambarModule,
    CartsModule,
    OrdersModule,
    OrdersDetailsModule,
    PaymentsModule,
    AuthModule,
    // Module lain akan diimpor di sini
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}