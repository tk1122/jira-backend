import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ProjectStatus } from '../entity/project.entity';

export class UpdateProjectBody {
  @ApiModelProperty()
  @IsNumber({}, { each: true })
  memberIds: number[];

  @ApiModelProperty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;
}
