import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './app.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtGuard } from './common/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './auth/middleware/auth.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`env/.env.${process.env.NODE_ENV}`, `env/.env`],
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        JwtStrategy,
    ],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*'); // Applies middleware to all routes
      }
}
