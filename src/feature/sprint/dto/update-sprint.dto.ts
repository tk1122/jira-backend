import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSprintBody {
  @ApiModelProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
