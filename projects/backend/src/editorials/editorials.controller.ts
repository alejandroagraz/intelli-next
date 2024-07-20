import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { EditorialDto } from './dto/editorial.dto';
import { DetailEditorialDto } from './dto/detail-editorial.dto';
import { CreateEditorialInput } from './inputs/create-editorial.input';
import { UpdateEditorialInput } from './inputs/update-editorial.input';
import { EditorialsService } from './editorials.service';

@ApiTags('Editorials')
@ApiBearerAuth('token')
@Controller('editorials')
export class EditorialsController {
  constructor(private readonly _editorialsService: EditorialsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all editorials' })
  @ApiExtraModels(PageDto, EditorialDto)
  @ApiPaginatedResponse(EditorialDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<EditorialDto>> {
    return await this._editorialsService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a editorial according to its ID' })
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
    type: [DetailEditorialDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailEditorialDto> {
    return await this._editorialsService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new editorial' })
  @ApiBody({ type: CreateEditorialInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [EditorialDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async create(
    @Body() newEditorial: CreateEditorialInput,
  ): Promise<EditorialDto> {
    return await this._editorialsService.create(newEditorial);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a editorial according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateEditorialInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [EditorialDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async update(
    @Param('id') id: string,
    @Body() updateEditorial: UpdateEditorialInput,
  ): Promise<EditorialDto> {
    return await this._editorialsService.update(id, updateEditorial);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a editorial according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove editorial' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    return await this._editorialsService.deleteOneByID(id);
  }
}
