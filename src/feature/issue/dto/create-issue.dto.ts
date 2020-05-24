import { ApiModelProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsInt, IsString, ValidateIf } from 'class-validator';
import { IssuePriority, IssueType } from '../entity/issue.entity';

export class CreateIssueBody {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty()
  @IsInt()
  assigneeId: number;

  @ApiModelProperty()
  @IsInt()
  reporterId: number;

  @ApiModelProperty()
  @IsInt()
  projectId: number;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.epicId !== undefined)
  @IsInt()
  epicId?: number;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.sprintId !== undefined)
  @IsInt()
  sprintId?: number;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.storyPoint !== undefined)
  @IsInt()
  storyPoint?: number;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.priority !== undefined)
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.type !== undefined)
  @IsEnum(IssueType)
  type?: IssueType;

  @ApiModelProperty()
  @ValidateIf((o: CreateIssueBody) => o.labelIds !== undefined)
  @IsInt({ each: true })
  @ArrayNotEmpty()
  labelIds?: number[];
}
