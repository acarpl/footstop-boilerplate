import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PaymentsService } from "./payments.service";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";

/**
 * Controller ini menangani semua interaksi yang berhubungan dengan pembayaran.
 */
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Endpoint untuk memulai sesi pembayaran di Midtrans.
   * - Dipanggil oleh frontend SETELAH pesanan berhasil dibuat.
   * - Membutuhkan login (diproteksi oleh AuthGuard).
   * - Menerima 'orderId' dari body request.
   * @returns {Promise<any>} Objek transaksi dari Midtrans yang berisi 'redirect_url'.
   */
  @Post("create-transaction")
  @UseGuards(AuthGuard("jwt")) // 1. Pastikan hanya pengguna yang login bisa mengakses
  createTransaction(
    @Body("orderId") orderId: number, // 2. Ambil 'orderId' dari body
    @GetUser() user: User // 3. Ambil data user yang sedang login dari token
  ) {
    // 4. Panggil service untuk melakukan pekerjaan berat
    return this.paymentsService.createMidtransTransaction(user, orderId);
  }

  /**
   * Endpoint untuk menerima notifikasi (webhook) dari server Midtrans.
   * - Endpoint ini HARUS bersifat publik (TIDAK BOLEH ada AuthGuard).
   * - Midtrans yang akan memanggilnya, bukan browser pengguna.
   * - Selalu mengembalikan status 200 OK agar Midtrans tahu notifikasi diterima.
   * @param notificationPayload - Seluruh body JSON yang dikirim oleh Midtrans.
   */
  @Post("midtrans-notification")
  @HttpCode(HttpStatus.OK) // 5. Selalu respons dengan 200 OK
  handleMidtransNotification(@Body() notificationPayload: any) {
    // 6. Teruskan seluruh payload ke service untuk divalidasi dan diproses
    return this.paymentsService.handleMidtransNotification(notificationPayload);
  }
}
