import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Ganti 'initiate' menjadi lebih spesifik
  @Post('create-transaction')
  @UseGuards(AuthGuard('jwt'))
  createTransaction(
    @Body('orderId') orderId: number,
    @GetUser() user: User,
  ) {
    return this.paymentsService.createMidtransTransaction(user, orderId);
  }

  // Endpoint untuk menerima webhook dari Midtrans
  @Post('midtrans-notification')
  handleMidtransNotification(@Body() notificationPayload: any) {
    return this.paymentsService.handleMidtransNotification(notificationPayload);
  }
}