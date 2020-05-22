import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetRoleBody {
  @ApiModelProperty()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
