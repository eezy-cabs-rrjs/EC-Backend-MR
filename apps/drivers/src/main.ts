import { NestFactory } from '@nestjs/core';
import { DriversModule } from './drivers.module';

async function bootstrap() {
  const app = await NestFactory.create(DriversModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
