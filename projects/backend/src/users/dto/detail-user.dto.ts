import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/constants/gender.constant';
import { IsUUID } from 'class-validator';
import { StatusUser } from '../../common/constants/status-user.constant';

export class DetailUserDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  dni: number;

  @ApiProperty()
  username: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    type: Gender,
    example: Gender.MAN,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Status User',
    enum: StatusUser,
    type: StatusUser,
    example: StatusUser.ACTIVE,
  })
  status: StatusUser;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
