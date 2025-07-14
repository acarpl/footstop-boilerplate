import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressModule } from './address/address.module';
import { GambarModule } from './gambar/gambar.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersDetailsModule } from './orders-details/orders-details.module';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Membuat ConfigService tersedia di seluruh aplikasi
    }),
    LoggerModule.forRoot({ // ✅ Tambahkan LoggerModule disini
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
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
    ProductsModule,
    PaymentsModule,
    AuthModule,
    UsersModule,
    // Module lain akan diimpor di sini
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
