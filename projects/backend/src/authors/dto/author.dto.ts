import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AuthorDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
