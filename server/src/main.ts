import { NestFactory } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
async function bootstrap() {
  const app = await NestFactory.create(PrismaModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
