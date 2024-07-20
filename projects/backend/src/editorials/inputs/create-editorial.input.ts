import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEditorialInput {
  @ApiProperty({ example: 'larense', required: true })
  @IsNotEmpty({ message: 'The name is required' })
  @MinLength(3, {
    message: 'Length error for name min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  readonly name: string;

  @ApiProperty({ example: '123 1234567', required: true })
  @IsNotEmpty({ message: 'The phone is required' })
  @MinLength(7, {
    message: 'Length error for phone min 7',
  })
  @IsString({ message: 'Format error for phone' })
  readonly phone: string;

  @ApiProperty({ example: 'email@email.com', required: true })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail()
  @MinLength(6, {
    message: 'Length error for email min 6',
  })
  @MaxLength(100, {
    message: 'Length email for email max 100',
  })
  readonly email: string;
}
