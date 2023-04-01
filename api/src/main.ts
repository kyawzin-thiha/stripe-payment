import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.WEB_URL,
    credentials: true,
  })

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
