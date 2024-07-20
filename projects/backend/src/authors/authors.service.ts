import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { AuthorDto } from './dto/author.dto';
import { CreateAuthorInput } from './inputs/create-author.input';
import { UpdateAuthorInput } from './inputs/update-author.input';
import { AuthorEntity } from './entity/author.entity';
import { DetailAuthorDto } from './dto/detail-author.dto';
import { Workbook } from 'exceljs';
import { FormatExcelService } from '../common/format-excel/format-excel.service';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly _formatExcelService: FormatExcelService,
    @InjectRepository(AuthorEntity)
    private readonly _authorRepository: Repository<AuthorEntity>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AuthorDto>> {
    const queryBuilder = this._authorRepository.createQueryBuilder('authors');

    queryBuilder
      .orderBy('authors.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailAuthorDto> {
    try {
      const author = await this._authorRepository
        .createQueryBuilder('author')
        .leftJoinAndSelect('author.book', 'book')
        .where('author.id = :id', { id: id })
        .getOne();

      if (!author) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
      }

      return author;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(data: CreateAuthorInput): Promise<AuthorDto> {
    const createAuthor = new AuthorEntity();

    createAuthor.name = data.name;
    createAuthor.lastname = data.lastname;

    try {
      return await this._authorRepository.save(createAuthor);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async update(id: string, data: UpdateAuthorInput): Promise<AuthorDto> {
    const date: Date = new Date();
    const updateAuthor = await this.findOneByID(id);

    if (!updateAuthor) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    updateAuthor.name = data.name || updateAuthor.name;
    updateAuthor.lastname = data.lastname || updateAuthor.lastname;
    updateAuthor.updated_at = date;

    try {
      return await this._authorRepository.save(updateAuthor);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      const isAuthor = await this.findOneByID(id);

      if (!isAuthor) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
      }

      await this._authorRepository
        .createQueryBuilder('authors')
        .softDelete()
        .from(AuthorEntity)
        .where('authors.id = :id', { id: id })
        .execute();

      return { status: 200, message: 'Success remove author' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<AuthorEntity> {
    return await this._authorRepository
      .createQueryBuilder('author')
      .where('author.id = :id', { id: id })
      .getOne();
  }

  async updateNumberBooksPublished(
    author_id: string,
    countBooks: number,
  ): Promise<void> {
    try {
      const author = await this._authorRepository
        .createQueryBuilder('authors')
        .where('authors.id = :id', { id: author_id })
        .getOne();

      if (author) {
        author.number_books_published = countBooks;
        await this._authorRepository.save(author);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateAllAuthorNumberBooksPublished(): Promise<void> {
    try {
      const authors = await this._authorRepository
        .createQueryBuilder('author')
        .leftJoin('author.book', 'book')
        .select('author.id', 'id')
        .addSelect('COUNT(book.id)')
        .orderBy('COUNT(book.id)', 'DESC')
        .groupBy('author.id')
        .getRawMany();

      for (let i = 1; i < authors.length; i++) {
        const author = await this._authorRepository
          .createQueryBuilder('author')
          .where('author.id = :id', { id: authors[i].id })
          .getOne();

        author.number_books_published = parseInt(authors[i].count);

        await this._authorRepository.save(author);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async exportReport(): Promise<any> {
    const authors = await this._authorRepository
      .createQueryBuilder('authors')
      .select([
        'authors.id, id',
        'authors.name, name',
        'authors.lastname, lastname',
        'authors.number_books_published, number_books_published AS published',
      ])
      .getRawMany();

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('exceljs-format');

    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' },
      { header: 'Lastname', key: 'lastname' },
      { header: 'Books Published', key: 'published' },
    ];

    authors.forEach((value, i, _) => {
      worksheet.addRow(value);
    });

    worksheet.getColumn(1).width = 25.5;
    worksheet.getColumn(2).width = 25.5;
    worksheet.getColumn(3).width = 25.5;
    worksheet.getColumn(4).width = 25.5;

    await this._formatExcelService.excelFormat(worksheet);

    return {
      fileName: `author-report-${Date.now()}.xlsx`,
      buffer: await workbook.xlsx.writeBuffer(),
    };
  }
}
