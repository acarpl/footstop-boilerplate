import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Endpoint ini dipanggil oleh frontend untuk memulai pembayaran.
   * Perlu login.
   */
  @Post('initiate')
  @UseGuards(AuthGuard('jwt'))
  initiatePayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetUser() user: User,
  ) {
    return this.paymentsService.initiatePayment(user, createPaymentDto);
  }

  /**
   * Endpoint ini dipanggil oleh SERVER payment gateway (webhook).
   * TIDAK perlu login, tapi di dunia nyata perlu metode keamanan lain
   * (misalnya, verifikasi signature/token dari payment gateway).
   */
  @Post('webhook')
  handleWebhook(@Body() webhookPayload: { order_id: number; transaction_status: string }) {
    // Di dunia nyata, Anda akan memvalidasi payload ini terlebih dahulu.
    if (webhookPayload.transaction_status === 'settlement' || webhookPayload.transaction_status === 'capture') {
      return this.paymentsService.handlePaymentSuccess(webhookPayload.order_id);
    }
    return { status: 'notification received' };
  }
}