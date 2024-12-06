// filterSections
// getSection
// createSection
// updateSection
// deleteSection

import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('book-section')
export class BookSectionController {
    constructor() {}

    @Post()
    filterBookSection() {}

    @Get(':book-sectionId')
    getBookSection() {}

    @Post('create-book-section')
    createBookSection() {}

    @Post('update-book-section/:book-sectionId')
    updateBookSection() {}

    @Delete(':book-sectionId')
    deleteBookSection() {}
}
