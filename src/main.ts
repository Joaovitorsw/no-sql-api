import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { APP_VALIDATION_PIPE } from './pipes/validator.pipe';
import { ErrorDomainService } from './services/error-domain/error-domain.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useGlobalPipes(APP_VALIDATION_PIPE);
  app.useGlobalInterceptors(
    new ResponseInterceptor(await app.resolve(ErrorDomainService)),
  );

  mongoose.set('debug', true);

  app.setGlobalPrefix('api/');

  await app.listen(3000);
}

bootstrap();
