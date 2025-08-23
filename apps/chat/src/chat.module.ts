import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        "apps",
        "chat",
        `.env.${process.env.NODE_ENV}`
      ),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
