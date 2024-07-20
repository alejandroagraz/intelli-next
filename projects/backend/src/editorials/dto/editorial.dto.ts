import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BookDto } from '../../books/dto/book.dto';

export class EditorialDto {
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
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
