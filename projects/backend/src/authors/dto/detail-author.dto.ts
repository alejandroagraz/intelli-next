import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BookDto } from '../../books/dto/book.dto';

export class DetailAuthorDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  book: BookDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
