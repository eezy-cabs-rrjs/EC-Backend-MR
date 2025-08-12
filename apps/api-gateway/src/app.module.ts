import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';
import { BookingModule } from './booking/booking.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    DriverModule,
    BookingModule,
    UserModule,
    AnalyticsModule,
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
