import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetManyIssueQuery {
  @ApiModelProperty()
  @Transform(val => Number(val))
  @IsInt()
  @Min(1)
  projectId: number;
}
