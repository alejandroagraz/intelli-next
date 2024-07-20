import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { EditorialDto } from './dto/editorial.dto';
import { DetailEditorialDto } from './dto/detail-editorial.dto';
import { CreateEditorialInput } from './inputs/create-editorial.input';
import { UpdateEditorialInput } from './inputs/update-editorial.input';
import { EditorialEntity } from './entity/editorial.entity';

@Injectable()
export class EditorialsService {
  constructor(
    @InjectRepository(EditorialEntity)
    private readonly _editorialRepository: Repository<EditorialEntity>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EditorialDto>> {
    const queryBuilder =
      this._editorialRepository.createQueryBuilder('editorials');

    queryBuilder
      .orderBy('editorials.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailEditorialDto> {
    try {
      const editorial = await this._editorialRepository
        .createQueryBuilder('editorial')
        .leftJoinAndSelect('editorial.book', 'book')
        .where('editorial.id = :id', { id: id })
        .getOne();

      if (!editorial) {
        throw new HttpException('Editorial not found', HttpStatus.NOT_FOUND);
      }

      return editorial;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(data: CreateEditorialInput): Promise<EditorialDto> {
    const createEditorial = new EditorialEntity();

    createEditorial.name = data.name;
    createEditorial.phone = data.phone;
    createEditorial.email = data.email;

    try {
      return await this._editorialRepository.save(createEditorial);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async update(id: string, data: UpdateEditorialInput): Promise<EditorialDto> {
    const date: Date = new Date();
    const updateEditorial = await this.findOneByID(id);

    if (!updateEditorial) {
      throw new HttpException('Editorial not found', HttpStatus.NOT_FOUND);
    }

    updateEditorial.name = data.name || updateEditorial.name;
    updateEditorial.phone = data.phone || updateEditorial.phone;
    updateEditorial.email = data.email || updateEditorial.email;
    updateEditorial.updated_at = date;

    try {
      return await this._editorialRepository.save(updateEditorial);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      const isEditorial = await this.findOneByID(id);

      if (!isEditorial) {
        throw new HttpException('Editorial not found', HttpStatus.NOT_FOUND);
      }

      await this._editorialRepository
        .createQueryBuilder('editorials')
        .softDelete()
        .from(EditorialEntity)
        .where('editorials.id = :id', { id: id })
        .execute();

      return { status: 200, message: 'Success remove editorial' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<EditorialEntity> {
    return await this._editorialRepository
      .createQueryBuilder('editorial')
      .where('editorial.id = :id', { id: id })
      .getOne();
  }
}
