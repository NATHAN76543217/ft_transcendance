import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as serveStatic from 'serve-static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  app.use('/uploads', serveStatic(__dirname + '/../uploads'));

  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret',
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const config = new DocumentBuilder()
    .addServer('https://localhost/api', 'Development server.')
    .setTitle('Transcendance')
    .setDescription('Transcendance API documentation.')
    .setVersion('1.0')
    .addTag('transcendance')
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(8080);
}
bootstrap();
