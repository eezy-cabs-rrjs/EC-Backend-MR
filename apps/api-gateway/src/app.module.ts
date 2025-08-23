import { Module } from '@nestjs/common';
import { PaymentModule } from './modules/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AnalyticsModule } from 'apps/analytics/src/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { DriverModule } from './modules/driver/driver.module';
import { UserModule } from './modules/user/user.module';

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
