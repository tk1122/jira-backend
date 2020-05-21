import { Body, Controller, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';
import { CreateIssueBody } from './dto/create-issue.dto';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';

@Controller('issues')
@ApiUseTags('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('')
  @Scopes(PermissionScopes.WriteIssue)
  createIssue(
    @Body()
    { name, description, assigneeId, reporterId, epicId, storyPoint, priority, type, labelIds }: CreateIssueBody,
    @User() { userId }: UserSession,
  ) {
    return this.issueService.createIssue(userId, name, description, assigneeId, reporterId, epicId, storyPoint, priority, type, labelIds);
  }
}
