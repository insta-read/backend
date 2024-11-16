import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './app.config';

console.log([`${process.cwd()}/env/.env.${process.env.NODE_ENV}`, `${process.cwd()}/env/.env`]);

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

    onModuleInit() {
        // Get all variables from process.env
        // console.log('Loaded Environment Variables:', this.configService.get('NODE_ENV'));
        console.log('All Environment Variables:', process.env); // Logs everything from process.env
      }
}
