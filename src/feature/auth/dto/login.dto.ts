import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
