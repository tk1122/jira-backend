import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { Scopes } from '../../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../../user/entity/permission.entity';
import { CreateLabelBody } from '../dto/create-label.dto';
import { IssueService } from '../issue.service';
import { User } from '../../../shared/decorator/user.decorator';
import { UserSession } from '../../../shared/interface/session.interface';
import { GetManyLabelQuery } from '../dto/get-label.dto';
import { LabelEntity } from '../entity/label.entity';

@Controller('labels')
@ApiUseTags('labels')
export class LabelController {
  constructor(private readonly issueService: IssueService) {}

  @Post('')
  @Scopes(PermissionScopes.WriteIssue)
  @ApiOkResponse({ type: LabelEntity })
  createLabel(@Body() { name, projectId }: CreateLabelBody, @User() { userId }: UserSession) {
    return this.issueService.createLabel(name, projectId, userId);
  }

  @Get('')
  @Scopes(PermissionScopes.ReadIssue)
  @ApiOkResponse({ type: LabelEntity, isArray: true })
  getManyLabel(@Query() { projectId }: GetManyLabelQuery, @User() { userId }: UserSession) {
    return this.issueService.getManyLabel(projectId, userId);
  }
}
