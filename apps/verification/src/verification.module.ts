import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "verification",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
