import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { EditorialDto } from '../../editorials/dto/editorial.dto';
import { AuthorDto } from '../../authors/dto/author.dto';

export class DetailBookDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  isbn: number;

  @ApiProperty()
  author: AuthorDto;

  @ApiProperty()
  editorial: EditorialDto;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
