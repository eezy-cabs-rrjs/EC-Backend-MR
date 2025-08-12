import { NestFactory } from '@nestjs/core';
import { VerificationModule } from './verification.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
