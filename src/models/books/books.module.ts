import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.services';

@Module({
    controllers: [BooksController],
    imports: [PrismaModule],
    providers: [BooksService],
    exports: [BooksService],
})
export class BooksModule {}
