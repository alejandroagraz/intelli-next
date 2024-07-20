import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEditorialInput {
  @ApiProperty({ example: 'larense', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: '123 1234567 ', required: false })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty({ example: 'email@email.com', required: false })
  @IsOptional()
  @IsString()
  readonly email?: string;
}
