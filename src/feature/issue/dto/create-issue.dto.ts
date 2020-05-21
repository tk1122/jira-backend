import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { IssuePriority, IssueType } from '../entity/issue.entity';

export class CreateIssueBody {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty()
  @IsNumber()
  assigneeId: number;

  @ApiModelProperty()
  @IsNumber()
  reporterId: number;

  @ApiModelProperty()
  @IsNumber()
  epicId: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  storyPoint?: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  priority?: IssuePriority;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  type?: IssueType;

  @ApiModelProperty()
  @IsInt({ each: true })
  @IsOptional()
  labelIds?: number[];
}
