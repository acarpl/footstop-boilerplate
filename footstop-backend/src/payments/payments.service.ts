import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as midtransClient from 'midtrans-client'; // Import library
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  private snap: midtransClient.Snap;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // Inject DataSource jika Anda perlu transaksi untuk handle webhook
  ) {
    // Inisialisasi Snap API client
    this.snap = new midtransClient.Snap({
      isProduction: configService.get<boolean>('MIDTRANS_IS_PRODUCTION'),
      serverKey: configService.get<string>('MIDTRANS_SERVER_KEY'),
      clientKey: configService.get<string>('MIDTRANS_CLIENT_KEY'),
    });
  }

  /**
   * [USER] Membuat sesi pembayaran di Midtrans untuk sebuah pesanan.
   */
  async createMidtransTransaction(user: User, orderId: number) {
    // 1. Ambil data pesanan dari database
    const order = await this.orderRepository.findOne({
      where: { id_order: orderId, user: { id_user: user.id_user } },
      relations: ['order_details', 'order_details.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID #${orderId} not found.`);
    }

    // 2. Siapkan parameter untuk Midtrans
    const parameter: midtransClient.Snap.TransactionParameter = {
      transaction_details: {
        order_id: `ORDER-${order.id_order}-${Date.now()}`, // Buat order ID unik
        gross_amount: Number(order.total_price),
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
        phone: user.phone_number,
      },
      item_details: order.orderDetails.map(item => ({
        id: String(item.product.id_product),
        price: Number(item.price_per_unit),
        quantity: item.quantity,
        name: item.product.product_name,
      })),
    };

    try {
      // 3. Panggil Midtrans API
      const transaction = await this.snap.createTransaction(parameter);
      
      // 4. Kembalikan URL pembayaran ke frontend
      return transaction; // Ini berisi 'token' dan 'redirect_url'
    } catch (error) {
      console.error("Midtrans transaction creation failed:", error);
      throw new InternalServerErrorException('Failed to create payment transaction.');
    }
  }

  /**
   * [WEBHOOK] Menangani notifikasi dari Midtrans.
   */
  async handleMidtransNotification(notification: any) {
    // 1. Verifikasi notifikasi menggunakan utility dari Midtrans
    const statusResponse = await this.snap.transaction.notification(notification);
    const orderIdString = statusResponse.order_id.split('-')[1];
    const orderId = parseInt(orderIdString, 10);
    const transactionStatus = statusResponse.transaction_status;
    
    // 2. Lakukan update database berdasarkan status transaksi
    // Gunakan transaksi database di sini untuk keamanan
    const order = await this.orderRepository.findOneBy({ id_order: orderId });
    if (!order) {
        throw new NotFoundException(`Webhook Error: Order #${orderId} not found.`);
    }

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        // Pembayaran berhasil
        order.status_pengiriman = 'Dibayar';
        await this.orderRepository.save(order);
    } else if (transactionStatus == 'pending') {
        // Masih menunggu pembayaran
    } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
        // Pembayaran gagal
        order.status_pengiriman = 'Dibatalkan';
        await this.orderRepository.save(order);
    }

    console.log(`Order #${orderId} status updated to ${order.status_pengiriman}`);
    return { status: 'ok' };
  }
}