import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
  Query,
  DefaultValuePipe,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "../users/entities/user.entity";

@Controller("orders")
@UseGuards(AuthGuard("jwt"))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- RUTE ADMIN (Lebih Spesifik, Taruh di Atas) ---

  @Get("admin/all")
  @UseGuards(RolesGuard)
  @Roles("admin")
  findAllForAdmin(
    @Query("page", new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query("limit", new DefaultValuePipe(10), new ParseIntPipe()) limit: number
  ) {
    return this.ordersService.findAllForAdmin({ page, limit });
  }

  @Get("admin/:id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  findOneForAdmin(@Param("id", ParseIntPipe) id: number) {
    return this.ordersService.findOneForAdmin(id);
  }

  @Patch("admin/:id/status")
  @UseGuards(RolesGuard)
  @Roles("admin")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  // --- RUTE PENGGUNA BIASA (Lebih Umum, Taruh di Bawah) ---

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(user, createOrderDto);
  }

  // Rute ini GET tanpa parameter, jadi urutannya tidak terlalu krusial
  // tapi lebih baik ditaruh di atas rute dengan parameter.
  @Get()
  findAllForUser(@GetUser() user: User) {
    return this.ordersService.findAllForUser(user.id_user);
  }

  // Rute ini paling umum (dinamis), jadi harus di PALING BAWAH
  // dari semua rute GET.
  @Get(":id")
  findOneForUser(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
    return this.ordersService.findOneForUser(user.id_user, id);
  }
}
