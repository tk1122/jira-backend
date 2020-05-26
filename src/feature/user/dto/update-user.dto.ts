
import { ApiModelProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UserStatus } from '../entity/user.entity';

export class UpdateUserBody {
  @ApiModelProperty()
  @IsString()
  @IsOptional()
  skill?: string | null;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  level?: string | null;

  @ApiModelProperty()
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus | null;

  @ApiModelProperty()
  @IsInt({each: true})
  @ValidateIf((o: UpdateUserBody) => o.roleIds !== undefined)
  @ArrayNotEmpty()
  roleIds?: number[]
}
