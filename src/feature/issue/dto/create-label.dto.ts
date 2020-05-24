import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLabelBody {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsNumber()
  projectId: number;
}
