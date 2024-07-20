import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorInput {
  @ApiProperty({ required: false, example: 'Leonel' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false, example: 'Messi' })
  @IsOptional()
  @IsString()
  readonly lastname?: string;
}
