import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

dotenv.config(); // Load .env variables

async function bootstrap() {
  const appModule = await AppModule.register();
  const app = await NestFactory.create(appModule);
  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();
