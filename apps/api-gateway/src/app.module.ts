import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';
import { BookingModule } from './booking/booking.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    DriverModule,
    BookingModule,
    UserModule,
    AnalyticsModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', `.env.${process.env.NODE_ENV}`),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
