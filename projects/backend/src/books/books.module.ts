import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entity/book.entity';
import { AuthorsModule } from '../authors/authors.module';
import { EditorialsModule } from '../editorials/editorials.module';
import { FormatExcelModule } from '../common/format-excel/format-excel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    AuthorsModule,
    EditorialsModule,
    FormatExcelModule,
  ],
  providers: [BooksService],
  exports: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
