import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable ETag generation for better performance
  (app as any).set('etag', false);

  // Middleware to remove 'x-powered-by' and 'date' headers from responses
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });

  await app.listen(3000);
}
bootstrap();
