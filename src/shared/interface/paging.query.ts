import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class PagingQuery {
  @ApiModelProperty({ required: false })
  @Transform(value => Number(value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiModelProperty({ required: false })
  @Transform(value => Number(value))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
