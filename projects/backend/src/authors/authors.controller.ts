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
import { Response } from 'express';
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
import { AuthorDto } from './dto/author.dto';
import { DetailAuthorDto } from './dto/detail-author.dto';
import { CreateAuthorInput } from './inputs/create-author.input';
import { UpdateAuthorInput } from './inputs/update-author.input';
import { AuthorsService } from './authors.service';

@ApiTags('Authors')
@ApiBearerAuth('token')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly _authorsService: AuthorsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all authors' })
  @ApiExtraModels(PageDto, AuthorDto)
  @ApiPaginatedResponse(AuthorDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<AuthorDto>> {
    return await this._authorsService.getAll(pageOptionsDto);
  }

  @Get('/export')
  @UseGuards(JwtAuthGuard)
  @Header('Content-type', 'text/xlsx')
  @ApiOperation({ summary: 'Exports data the all authors' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async exportReport(@Res() res: Response): Promise<Response> {
    const result = await this._authorsService.exportReport();
    return res
      .set('Content-Disposition', `attachment; filename=${result.fileName}`)
      .send(result.buffer);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a author according to its ID' })
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
    type: [DetailAuthorDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailAuthorDto> {
    return await this._authorsService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new author' })
  @ApiBody({ type: CreateAuthorInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [AuthorDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async create(@Body() newAuthor: CreateAuthorInput): Promise<AuthorDto> {
    return await this._authorsService.create(newAuthor);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a author according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateAuthorInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [AuthorDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async update(
    @Param('id') id: string,
    @Body() updateAuthor: UpdateAuthorInput,
  ): Promise<AuthorDto> {
    return await this._authorsService.update(id, updateAuthor);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a author according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove author' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    return await this._authorsService.deleteOneByID(id);
  }
}
