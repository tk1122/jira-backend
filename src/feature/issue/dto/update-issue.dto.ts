import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, NotEquals, ValidateIf } from 'class-validator';
import { IssuePriority, IssueStatus, IssueType } from '../entity/issue.entity';

export class UpdateIssueBody {
  @ApiModelProperty()
  @ValidateIf((o: UpdateIssueBody) => o.name !== undefined)
  @IsString()
  name?: string;

  @ApiModelProperty()
  @IsString()
  @ValidateIf((o: UpdateIssueBody) => o.description !== undefined)
  description?: string;

  @ApiModelProperty()
  @IsInt()
  @Min(1)
  @ValidateIf((o: UpdateIssueBody) => o.assigneeId !== undefined)
  assigneeId?: number;

  @ApiModelProperty()
  @IsInt()
  @Min(1)
  @ValidateIf((o: UpdateIssueBody) => o.reporterId !== undefined)
  reporterId?: number;

  @ApiModelProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  epicId?: number | null;

  @ApiModelProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  sprintId?: number | null;

  @ApiModelProperty()
  @IsInt()
  @Min(1)
  @ValidateIf((o: UpdateIssueBody) => o.storyPoint !== undefined)
  storyPoint?: number;

  @ApiModelProperty()
  @IsEnum(IssuePriority)
  @ValidateIf((o: UpdateIssueBody) => o.priority !== undefined)
  priority?: IssuePriority;

  @ApiModelProperty()
  @IsEnum(IssueType)
  @ValidateIf((o: UpdateIssueBody) => o.type !== undefined)
  type?: IssueType;

  @ApiModelProperty()
  @ValidateIf((o: UpdateIssueBody) => o.labelIds !== undefined)
  @IsInt({ each: true })
  @IsArray()
  labelIds?: number[];
}

export class UpdateIssueStatusBody {
  @ApiModelProperty()
  @IsEnum(IssueStatus)
  status: IssueStatus
}
