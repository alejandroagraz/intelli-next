import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BookDto } from '../../books/dto/book.dto';

export class DetailEditorialDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  book: BookDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
