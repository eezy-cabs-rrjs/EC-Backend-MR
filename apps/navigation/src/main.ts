import { NestFactory } from '@nestjs/core';
import { NavigationModule } from './navigation.module';

async function bootstrap() {
  const app = await NestFactory.create(NavigationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
