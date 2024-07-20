import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBookInput {
  @ApiProperty({ example: 'Pasito a pasito', required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ example: '2024', required: false, type: String })
  @IsOptional()
  @IsNumberString()
  readonly year?: number;

  @ApiProperty({ example: '1234567890', required: false, type: String })
  @IsOptional()
  @IsNumberString()
  readonly isbn?: number;

  @ApiProperty({
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  readonly author_id?: string;

  @ApiProperty({
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  readonly editorial_id?: string;
}
