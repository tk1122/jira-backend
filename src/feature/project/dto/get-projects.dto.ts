import { PagingQuery } from '../../../shared/interface/paging.query';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../entity/project.entity';

export class GetProjectsQuery extends PagingQuery {
  @ApiModelProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
