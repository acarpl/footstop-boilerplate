import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as midtransClient from "midtrans-client";
import { Order } from "../orders/entities/order.entity";
import { User } from "../users/entities/user.entity";

/**
 * PaymentsService mengelola semua interaksi dengan payment gateway (Midtrans)
 * dan menangani logika setelah pembayaran berhasil atau gagal.
 */
@Injectable()
export class PaymentsService {
  // Instance dari Midtrans Snap API client
  private snap: midtransClient.Snap;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {
    // Inisialisasi Snap client saat service dibuat
    this.snap = new midtransClient.Snap({
      isProduction: configService.get("MIDTRANS_IS_PRODUCTION") === "true",
      serverKey: configService.get<string>("MIDTRANS_SERVER_KEY"),
      clientKey: configService.get<string>("MIDTRANS_CLIENT_KEY"),
    });
  }

  /**
   * [USER] Membuat sesi pembayaran baru di Midtrans untuk sebuah pesanan.
   * Dipanggil oleh pengguna setelah mereka membuat pesanan.
   * @param user - Objek pengguna yang sedang login.
   * @param orderId - ID dari pesanan yang akan dibayar.
   * @returns Objek transaksi dari Midtrans yang berisi `token` dan `redirect_url`.
   */
  async createMidtransTransaction(user: User, orderId: number) {
    // 1. Ambil data pesanan lengkap dari database untuk memastikan validitas
    const order = await this.orderRepository.findOne({
      where: { id_order: orderId, user: { id_user: user.id_user } },
      relations: ["order_details", "order_details.product"],
    });

    if (!order) {
      throw new NotFoundException(
        `Order with ID #${orderId} not found for this user.`
      );
    }

    // 2. Siapkan parameter yang akan dikirim ke Midtrans
    const parameter: midtransClient.Snap.TransactionParameter = {
      transaction_details: {
        // Buat ID pesanan yang unik untuk setiap percobaan transaksi
        order_id: `FOOTSTOP-${order.id_order}-${Date.now()}`,
        gross_amount: Number(order.total_price),
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
        phone: user.phone_number,
      },
      // Sertakan detail item yang dibeli
      item_details: order.orderDetails.map((item) => ({
        id: String(item.product.id_product),
        price: Number(item.price_per_unit),
        quantity: item.quantity,
        name: item.product.product_name.substring(0, 50), // Batasi panjang nama
      })),
    };

    try {
      // 3. Panggil API Midtrans untuk membuat transaksi
      const transaction = await this.snap.createTransaction(parameter);

      // 4. Kembalikan hasilnya (termasuk redirect_url) ke controller
      return transaction;
    } catch (error) {
      console.error(
        "Midtrans transaction creation failed:",
        error.ApiResponse?.body || error.message
      );
      throw new InternalServerErrorException(
        "Failed to create payment transaction."
      );
    }
  }

  /**
   * [WEBHOOK] Menangani notifikasi (webhook) yang dikirim oleh server Midtrans.
   * @param notificationPayload - Seluruh body JSON dari notifikasi Midtrans.
   */
  async handleMidtransNotification(notificationPayload: any) {
    try {
      // 1. Verifikasi notifikasi untuk keamanan.
      // Ini akan melempar error jika notifikasi tidak otentik.
      const statusResponse = await this.snap.transaction.notification(
        notificationPayload
      );

      // Ekstrak ID pesanan dari database kita
      const orderIdString = statusResponse.order_id.split("-")[1];
      const orderId = parseInt(orderIdString, 10);
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      const order = await this.orderRepository.findOneBy({ id_order: orderId });
      if (!order) {
        console.warn(`Webhook ignored: Order #${orderId} not found.`);
        return; // Hentikan jika pesanan tidak ada
      }

      // 2. Update status pesanan di database berdasarkan status dari Midtrans
      if (transactionStatus == "capture" || transactionStatus == "settlement") {
        if (fraudStatus == "accept") {
          // Pembayaran berhasil dan aman
          order.status_pengiriman = "Dibayar";
        }
      } else if (transactionStatus == "pending") {
        // Biarkan status 'Pending', tidak perlu diubah
      } else if (
        transactionStatus == "deny" ||
        transactionStatus == "expire" ||
        transactionStatus == "cancel"
      ) {
        // Pembayaran gagal atau dibatalkan
        order.status_pengiriman = "Dibatalkan";
      }

      // 3. Simpan perubahan ke database
      await this.orderRepository.save(order);
      console.log(
        `Webhook received: Order #${orderId} status updated to ${order.status_pengiriman}`
      );
    } catch (error) {
      // Tangani jika verifikasi notifikasi gagal
      console.error(
        "Midtrans notification handling failed:",
        error.ApiResponse?.body || error.message
      );
      // Jangan lempar error di sini agar Midtrans tidak terus mengirim ulang
    }
  }
}
