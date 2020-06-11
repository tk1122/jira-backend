import { IsInt, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class MarkAsReceivedQuery {
  @ApiModelProperty()
  @IsInt()
  @Min(1)
  userId: number;
}
