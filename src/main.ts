import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS with default or custom configuration
    app.enableCors({
        origin: ['http://localhost:4200', '*'], // Allow specific origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
        allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
        credentials: true, // Allow cookies from CORS requests
    });

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('InstaRead Backend')
        .setDescription('')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
