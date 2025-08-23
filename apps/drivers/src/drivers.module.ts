import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "drivers",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
