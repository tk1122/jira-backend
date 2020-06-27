import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSprintBody {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty()
  @IsNumber()
  projectId: number;
}
