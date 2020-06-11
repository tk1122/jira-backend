import { ApiModelProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateEpicBody {
  @ApiModelProperty()
  @IsString()
  @ValidateIf((o: UpdateEpicBody) => o.name !== undefined)
  name?: string;

  @ApiModelProperty()
  @IsString()
  @ValidateIf((o: UpdateEpicBody) => o.description !== undefined)
  description?: string;

  @ApiModelProperty()
  @IsISO8601()
  @ValidateIf((o: UpdateEpicBody) => o.startDate !== undefined)
  startDate?: Date;

  @ApiModelProperty()
  @IsISO8601()
  @ValidateIf((o: UpdateEpicBody) => o.endDate !== undefined)
  endDate?: Date;
}
