import { Module } from '@nestjs/common';
import { SharedPaymentService } from './shared-payment.service';

@Module({
  providers: [SharedPaymentService],
  exports: [SharedPaymentService],
})
export class SharedPaymentModule {}
