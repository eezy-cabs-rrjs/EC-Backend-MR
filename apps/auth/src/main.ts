import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,{
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/auth.proto')
    }
  });
  await app.listen();
  Logger.log("Auth application running successfully on gRPC channel!")
}
bootstrap();
