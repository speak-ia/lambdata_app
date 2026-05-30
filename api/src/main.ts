import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());
  app.enableCors({
    origin:
      process.env.DEV_ALLOW_ALL_CORS === "true"
        ? true
        : (corsOrigins ?? ["http://localhost:3000"]),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Lambdata API")
    .setDescription("API de collecte de données IA africaines")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? "0.0.0.0";
  await app.listen(port, host);
  const lanIp = process.env.LAN_IP ?? "192.168.1.3";
  console.log(`Lambdata API (local):  http://localhost:${port}/api/v1`);
  console.log(`Lambdata API (mobile): http://${lanIp}:${port}/api/v1`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
