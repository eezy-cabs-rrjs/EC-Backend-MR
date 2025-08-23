import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "navigation",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [NavigationController],
  providers: [NavigationService],
})
export class NavigationModule {}
