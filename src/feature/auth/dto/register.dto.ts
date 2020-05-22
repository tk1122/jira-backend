import { ApiModelProperty } from '@nestjs/swagger';
import { UserGender } from '../../user/entity/user.entity';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterBody {
  @IsString()
  @ApiModelProperty()
  username: string;

  @IsString()
  @ApiModelProperty()
  fullname: string;

  @IsString()
  @ApiModelProperty()
  password: string;

  @IsEmail()
  @ApiModelProperty()
  email: string;

  @IsNumber()
  @ApiModelProperty()
  age: number;

  @IsNumber()
  @ApiModelProperty()
  gender: UserGender;
}
