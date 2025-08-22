import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";
import { BrandsModule } from "./brands/brands.module";
import { CartsModule } from "./carts/carts.module";
import { CategoriesModule } from "./categories/categories.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { GambarModule } from "./gambar/gambar.module";
import { OrdersModule } from "./orders/orders.module";
import { OrdersDetailsModule } from "./orders-details/orders-details.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProductsModule } from "./products/products.module";
import { RoleModule } from "./role/role.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: false,
      }),
    }),

    AddressModule,
    AuthModule,
    BrandsModule,
    CartsModule,
    CategoriesModule,
    DashboardModule,
    GambarModule,
    OrdersModule,
    OrdersDetailsModule,
    PaymentsModule,
    ProductsModule,
    RoleModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
