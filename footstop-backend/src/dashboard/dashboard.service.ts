import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../orders/entities/order.entity";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async getDashboardStats() {
    // GANTI 'totalPrice' menjadi nama properti yang benar di Order entity (misal: 'total_price')
    const totalRevenueResult = await this.orderRepo.sum("totalPrice", {
      statusPengiriman: "Selesai",
    });

    // GANTI 'statusPengiriman' menjadi nama properti yang benar di Order entity (misal: 'status_pengiriman')
    const newOrders = await this.orderRepo.count({
      where: { statusPengiriman: "Dibayar" },
    });

    const totalUsers = await this.userRepo.count();

    return {
      totalRevenue: totalRevenueResult || 0,
      newOrders: newOrders,
      totalUsers: totalUsers,
    };
  }
}
