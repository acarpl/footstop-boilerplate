import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Metode untuk memulai proses pembayaran.
   * Di dunia nyata, di sini Anda akan memanggil SDK payment gateway.
   */
  async initiatePayment(user: User, createPaymentDto: CreatePaymentDto) {
    const { idOrder, paymentMethod } = createPaymentDto;

    // 1. Verifikasi bahwa order ada dan milik user yang benar
    const order = await this.orderRepository.findOneBy({ idOrder, user: { id_user: user.id_user } });
    if (!order) {
      throw new NotFoundException(`Order with ID #${idOrder} not found.`);
    }

    // 2. Cek apakah order sudah dibayar
    if (order.statusPengiriman !== 'Pending') {
      throw new ConflictException('This order has already been processed.');
    }

    // --- SIMULASI INTERAKSI DENGAN PAYMENT GATEWAY ---
    // Di sini Anda akan menggunakan library seperti 'midtrans-client'
    // const midtrans = new Midtrans.Snap(...);
    // const transaction = await midtrans.createTransaction(...);
    // return { paymentUrl: transaction.redirect_url };
    // ---------------------------------------------------

    console.log(`Initiating payment for Order #${idOrder} using ${paymentMethod}.`);
    
    // Untuk pengembangan, kita kembalikan URL dummy
    return {
      message: 'Payment initiated successfully.',
      paymentUrl: `https://dummy-payment-gateway.com/pay?orderId=${idOrder}&amount=${order.totalPrice}`,
      orderId: order.idOrder,
    };
  }

  /**
   * Metode untuk menangani notifikasi webhook dari payment gateway.
   * Ini adalah proses yang paling kritikal.
   */
  async handlePaymentSuccess(orderId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Cari order yang sesuai
      const order = await queryRunner.manager.findOneBy(Order, { idOrder: orderId });
      if (!order) {
        throw new NotFoundException(`Webhook Error: Order with ID #${orderId} not found.`);
      }
      
      // 2. Buat catatan pembayaran baru
      const newPayment = queryRunner.manager.create(Payment, {
        order: { idOrder: orderId },
        paymentMethod: 'Simulated Gateway', // Atau ambil dari payload webhook
        paymentStatus: 'Success',
      });
      await queryRunner.manager.save(newPayment);

      // 3. Update status order menjadi 'Dibayar' atau 'Diproses'
      order.statusPengiriman = 'Dibayar'; // Atau 'Diproses'
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      console.log(`Payment for Order #${orderId} has been successfully processed.`);
      return { status: 'success' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(`Failed to process payment for Order #${orderId}`, err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}