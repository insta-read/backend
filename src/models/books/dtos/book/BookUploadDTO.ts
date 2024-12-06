import { PickType } from "@nestjs/swagger";
import { BookEntity } from "../../entity/book.entity";


export class BookUploadDto extends PickType(BookEntity, ['title', 'pdfUrl', 'totalPages']) {
    
}
