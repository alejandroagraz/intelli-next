import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto } from '../common/dtos/page.dto';
import { ApiPaginatedResponse } from '../common/dtos/api-pagination-response';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { BookDto } from './dto/book.dto';
import { DetailBookDto } from './dto/detail-book.dto';
import { CreateBookInput } from './inputs/create-book.input';
import { UpdateBookInput } from './inputs/update-book.input';
import { BooksService } from './books.service';
import { Response } from 'express';

@ApiTags('Books')
@ApiBearerAuth('token')
@Controller('books')
export class BooksController {
  constructor(private readonly _booksService: BooksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all books' })
  @ApiExtraModels(PageDto, BookDto)
  @ApiPaginatedResponse(BookDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BookDto>> {
    return await this._booksService.getAll(pageOptionsDto);
  }

  @Get('/export')
  @UseGuards(JwtAuthGuard)
  @Header('Content-type', 'text/xlsx')
  @ApiOperation({ summary: 'Exports data the all authors' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async exportReport(@Res() res: Response): Promise<Response> {
    const result = await this._booksService.exportReport();
    return res
      .set('Content-Disposition', `attachment; filename=${result.fileName}`)
      .send(result.buffer);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a book according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [DetailBookDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailBookDto> {
    return await this._booksService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new book' })
  @ApiBody({ type: CreateBookInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [BookDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async create(@Body() newBook: CreateBookInput): Promise<BookDto> {
    return await this._booksService.create(newBook);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a book according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateBookInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [BookDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async update(
    @Param('id') id: string,
    @Body() updateBook: UpdateBookInput,
  ): Promise<BookDto> {
    return await this._booksService.update(id, updateBook);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a book according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove book' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    return await this._booksService.deleteOneByID(id);
  }
}
