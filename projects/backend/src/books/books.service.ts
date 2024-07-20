import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { BookDto } from './dto/book.dto';
import { CreateBookInput } from './inputs/create-book.input';
import { UpdateBookInput } from './inputs/update-book.input';
import { BookEntity } from './entity/book.entity';
import { DetailBookDto } from './dto/detail-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { EditorialsService } from '../editorials/editorials.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NumberBooksPublishedEvent } from '../events/number-books-published.event';
import { Workbook } from 'exceljs';
import { FormatExcelService } from '../common/format-excel/format-excel.service';
import * as moment from 'moment';

@Injectable()
export class BooksService {
  constructor(
    private readonly _authorsService: AuthorsService,
    private readonly _editorialsService: EditorialsService,
    private readonly _formatExcelService: FormatExcelService,
    private readonly _eventEmitter: EventEmitter2,

    @InjectRepository(BookEntity)
    private readonly _bookRepository: Repository<BookEntity>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<BookDto>> {
    const queryBuilder = this._bookRepository.createQueryBuilder('books');

    queryBuilder
      .orderBy('books.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailBookDto> {
    try {
      const book = await this._bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author')
        .leftJoinAndSelect('book.editorial', 'editorial')
        .where('book.id = :id', { id: id })
        .getOne();

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      return book;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(data: CreateBookInput): Promise<BookDto> {
    const createBook = new BookEntity();

    if (moment(data.year).format() > moment().add(1, 'y').format())
      throw new HttpException(
        'The year must be less than or equal to the current year',
        HttpStatus.NOT_IMPLEMENTED,
      );

    const isAuthor = await this._authorsService.findOneByID(data.author_id);

    if (!isAuthor) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    const isEditorial = await this._editorialsService.findOneByID(
      data.editorial_id,
    );

    if (!isEditorial) {
      throw new HttpException('Editorial not found', HttpStatus.NOT_FOUND);
    }

    createBook.title = data.title;
    createBook.year = data.year;
    createBook.isbn = data.isbn;
    createBook.author = isAuthor;
    createBook.editorial = isEditorial;

    try {
      const book = await this._bookRepository.save(createBook);

      this._eventEmitter.emit(
        'number.books.published',
        new NumberBooksPublishedEvent(
          isAuthor.id,
          await this.countBooksByAuthorId(isAuthor.id),
        ),
      );

      return book;
    } catch (e) {
      if (e.code == 23505)
        throw new HttpException(
          'ISBN previously registered',
          HttpStatus.NOT_IMPLEMENTED,
        );
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async update(id: string, data: UpdateBookInput): Promise<BookDto> {
    const date: Date = new Date();
    const updateBook = await this.findOneByID(id);
    const lastAuthorId = updateBook.author.id;

    if (!updateBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (moment(data.year).format() > moment().add(1, 'y').format())
      throw new HttpException(
        'The year must be less than or equal to the current year',
        HttpStatus.NOT_IMPLEMENTED,
      );

    if (data.author_id) {
      const isAuthor = await this._authorsService.findOneByID(data.author_id);

      if (!isAuthor) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
      }

      updateBook.author = isAuthor;
    }

    if (data.editorial_id) {
      const isEditorial = await this._editorialsService.findOneByID(
        data.editorial_id,
      );

      if (!isEditorial) {
        throw new HttpException('Editorial not found', HttpStatus.NOT_FOUND);
      }

      updateBook.editorial = isEditorial;
    }

    updateBook.title = data.title || updateBook.title;
    updateBook.year = data.year || updateBook.year;
    updateBook.isbn = data.isbn || updateBook.isbn;
    updateBook.updated_at = date;

    try {
      const book = await this._bookRepository.save(updateBook);

      if (data.author_id) {
        this._eventEmitter.emit(
          'number.books.published',
          new NumberBooksPublishedEvent(
            data.author_id,
            await this.countBooksByAuthorId(data.author_id),
          ),
        );

        this._eventEmitter.emit(
          'number.books.published',
          new NumberBooksPublishedEvent(
            lastAuthorId,
            await this.countBooksByAuthorId(lastAuthorId),
          ),
        );
      }

      return book;
    } catch (e) {
      if (e.code == 23505)
        throw new HttpException(
          'ISBN previously registered',
          HttpStatus.NOT_IMPLEMENTED,
        );
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      const isBook = await this.findOneByID(id);

      if (!isBook) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      await this._bookRepository
        .createQueryBuilder('books')
        .softDelete()
        .from(BookEntity)
        .where('books.id = :id', { id: id })
        .execute();

      if (isBook.author.id)
        this._eventEmitter.emit(
          'number.books.published',
          new NumberBooksPublishedEvent(
            isBook.author.id,
            await this.countBooksByAuthorId(isBook.author.id),
          ),
        );

      return { status: 200, message: 'Success remove book' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<BookEntity> {
    try {
      return await this._bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author')
        .where('book.id = :id', { id: id })
        .getOne();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async countBooksByAuthorId(authorId: string): Promise<number> {
    try {
      return await this._bookRepository
        .createQueryBuilder('book')
        .leftJoin('book.author', 'author')
        .where('author.id = :id', { id: authorId })
        .getCount();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async exportReport(): Promise<any> {
    const books = await this._bookRepository
      .createQueryBuilder('books')
      .leftJoin('books.author', 'author')
      .leftJoin('books.editorial', 'editorial')
      .select([
        'books.id AS id',
        'books.title AS title',
        'books.year AS year',
        'books.isbn AS isbn',
        'author.name AS author',
        'editorial.name AS editorial',
      ])
      .getRawMany();

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('exceljs-format');

    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Title', key: 'title' },
      { header: 'ISBN', key: 'isbn' },
      { header: 'Author', key: 'author' },
      { header: 'Editorial', key: 'editorial' },
    ];

    books.forEach((value, i, _) => {
      worksheet.addRow(value);
    });

    worksheet.getColumn(1).width = 30.5;
    worksheet.getColumn(2).width = 30.5;
    worksheet.getColumn(3).width = 30.5;
    worksheet.getColumn(4).width = 30.5;
    worksheet.getColumn(5).width = 30.5;

    await this._formatExcelService.excelFormat(worksheet);

    return {
      fileName: `book-report-${Date.now()}.xlsx`,
      buffer: await workbook.xlsx.writeBuffer(),
    };
  }
}
