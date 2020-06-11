import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ProjectStatus } from '../entity/project.entity';

export class UpdateProjectBody {
  @ApiModelProperty()
  @IsInt({ each: true })
  @ValidateIf((o: UpdateProjectBody) => o.memberIds !== undefined)
  @IsArray()
  memberIds?: number[];

  @ApiModelProperty()
  @ValidateIf((o: UpdateProjectBody) => o.status !== undefined)
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiModelProperty()
  @ValidateIf((o: UpdateProjectBody) => o.name !== undefined)
  @IsString()
  name?: string;

  @ApiModelProperty()
  @ValidateIf((o: UpdateProjectBody) => o.description !== undefined)
  @IsString()
  description?: string;

  @ApiModelProperty()
  @ValidateIf((o: UpdateProjectBody) => o.leaderId !== undefined)
  @IsInt()
  leaderId?: number;
}
