import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { rawBodyMiddleware } from './middlewares';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(rawBodyMiddleware());
    await app.listen(port);
}
bootstrap();
