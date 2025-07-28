import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Proteksi semua endpoint di controller ini
export class DashboardController {
    ordersService: any;
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    @Roles('admin') // Hanya admin yang bisa akses
    getStats() {
        return this.dashboardService.getDashboardStats();
    }
 // Endpoint untuk admin melihat semua order
  @Get('all') // Beri path yang berbeda agar tidak bentrok dengan GET milik user
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllForAdmin() {
      // 2. Metode ini akan kita buat di service
      return this.ordersService.findAllForAdmin();
  }

  // Endpoint untuk admin mengubah status order
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
      // 3. Metode ini akan kita buat di service
      return this.ordersService.updateStatus(id, status);
  }
}