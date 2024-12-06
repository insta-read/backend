import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('books')
export class BooksController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    getAllBooks() {}

    @Get(':bookId')
    getBook(@Param('bookId') bookId: number) {}

    @Get('book-by-ids')
    getBooksByIds() {}

    @Post('upload-book')
    uploadBook() {}

    @Post('update-book/:bookId')
    updateBook(@Param('bookId') bookId: number) {}

    @Delete(':bookId')
    deleteBook(@Param('bookId') bookId: number) {}

    // getBooks
    // getBook
    // getBooksByIds

    // uploadBook
    // updateBook
    // deleteBook
}
