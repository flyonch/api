import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());


  // веб версия документации
  const config = new DocumentBuilder()
    .setTitle("ApiClients")
    .setDescription("Описание")
    .setVersion("0.0.1")
    .addTag("projectClients")
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, doc)

  await app.listen(PORT, () => console.log(`Server start on port = ${PORT}`));
}

start();
