import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BookDto {
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
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
