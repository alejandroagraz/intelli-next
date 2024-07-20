import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookInput {
  @ApiProperty({ example: 'Pasito a pasito', required: true })
  @IsNotEmpty({ message: 'The title is required' })
  @MinLength(3, {
    message: 'Length error for title min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  readonly title: string;

  @ApiProperty({ example: '2024', required: true, type: String })
  @IsNotEmpty({ message: 'The year is required' })
  @IsNumberString()
  @Length(4, 4, {
    message: 'Length error for year min 4 and max 4',
  })
  readonly year: number;

  @ApiProperty({ example: '1234567890', required: true, type: String })
  @IsNotEmpty({ message: 'The isbn is required' })
  @IsNumberString()
  @Length(10, 13, {
    message: 'Length error for isbn min 10 and max 13',
  })
  readonly isbn: number;

  @ApiProperty({
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
    required: true,
  })
  @IsNotEmpty({ message: 'The author_id is required' })
  @IsUUID('4')
  readonly author_id: string;

  @ApiProperty({
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
    required: true,
  })
  @IsNotEmpty({ message: 'The editorial_id is required' })
  @IsUUID('4')
  readonly editorial_id: string;
}
