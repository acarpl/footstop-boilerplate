// payments/payments.controller.ts

import { 
  Controller, 
  Post, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Body,
  Get,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GetUser } from '../auth/decorators/get-user.decorator'; // Adjust import path as needed
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * [POST] /payments/create-transaction/:orderId
   * Create payment transaction for an order
   */
  @Post('create-transaction/:orderId')
  async createTransaction(
    @GetUser() user: User,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    try {
      const transaction = await this.paymentsService.createMidtransTransaction(user, orderId);
      
      return {
        message: 'Payment transaction created successfully',
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      };
    } catch (error) {
      throw error; // Let NestJS handle the error response
    }
  }

  /**
   * [GET] /payments/status/:orderId
   * Get payment status for an order (optional endpoint)
   */
  @Get('status/:orderId')
  async getPaymentStatus(
    @GetUser() user: User,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    // This would require additional logic in your service
    // For now, just return a placeholder
    return {
      message: 'Payment status check not implemented yet',
      orderId,
    };
  }

  /**
   * [POST] /payments/webhook
   * Handle Midtrans webhook notifications (no auth guard needed)
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() notification: any) {
    try {
      const result = await this.paymentsService.handleMidtransNotification(notification);
      return result;
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }
}