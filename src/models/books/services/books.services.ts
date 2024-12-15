import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BookUploadDto } from '../dtos/book/BookUploadDTO';
import { BookEntity } from '../entity/book.entity';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) {}

    uploadBook(uploadBook: BookUploadDto) {
        // const book: BookEntity = this.prisma.book.create({ data : uploadBook}) as any
        // return Promise.resolve(book);
    }

    findBookById(id: number) {
        // return this.prisma.book.findUnique({ where: { id } });
    }
}
