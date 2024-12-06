import { IsOptional } from 'class-validator';

export class BookEntity {
    id: Number;
    uploadedByUserId: Number;
    title: String;
    pdfUrl: String;
    totalPages: Number;
    
    @IsOptional()
    author: String;

    @IsOptional()
    genre: String;

    @IsOptional()
    metadata: String;

    @IsOptional()
    createdAt: Date;
    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    deletedAt: Date;
    //   sections: Section[];
}
