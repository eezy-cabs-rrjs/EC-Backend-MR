import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "users",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
