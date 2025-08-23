import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "booking",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
