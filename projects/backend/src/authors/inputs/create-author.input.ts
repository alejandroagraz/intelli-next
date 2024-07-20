import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthorInput {
  @ApiProperty({ example: 'Cristiano', required: true })
  @IsNotEmpty({ message: 'The name is required' })
  @MinLength(3, {
    message: 'Length error for name min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Ronaldo', required: true })
  @IsNotEmpty({ message: 'The lastname is required' })
  @IsString()
  readonly lastname: string;
}
