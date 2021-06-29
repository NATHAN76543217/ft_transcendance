import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as serveStatic from 'serve-static';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector)
  ));
  app.use(cookieParser());

  app.use('/uploads', serveStatic(__dirname + '/../uploads'));
  
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "secret"
  }))

  const config = new DocumentBuilder()
    .setTitle('Transcendance')
    .setDescription('The transcendance API.')
    .setVersion('1.0')
    .addTag('transcendance')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(8080);
}
bootstrap();
