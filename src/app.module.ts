import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`env/.env.${process.env.NODE_ENV}`, `env/.env`],
            isGlobal: true,
            load: [configuration],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {}
}
