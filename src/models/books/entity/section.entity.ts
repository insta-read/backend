import { IsOptional } from 'class-validator';

export class BookSectionEntity {
    id: Number;
    title: String;
    // type            SectionType  // Type of section
    bookId: Number;

    @IsOptional()
    description: String;

    @IsOptional()
    parentSectionId: Number;

    startPage: Number;
    endPage: Number;

    @IsOptional()
    startOffset: Number;

    @IsOptional()
    endOffset: Number;
    // notes           Note[]       // Notes associated with this section
    //   comments        Comment[]    // Comments for this section

    @IsOptional()
    createdAt: Date;
    
    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    deletedAt: Date;
    //   viewSections    ViewSection[]   // Links to Views

    createdByUserId: Number;
}
