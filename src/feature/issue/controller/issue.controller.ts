import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { IssueService } from '../issue.service';
import { Scopes } from '../../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../../user/entity/permission.entity';
import { CreateIssueBody } from '../dto/create-issue.dto';
import { User } from '../../../shared/decorator/user.decorator';
import { UserSession } from '../../../shared/interface/session.interface';
import { IssueEntity } from '../entity/issue.entity';
import { GetManyIssueQuery } from '../dto/get-issue.dto';
import { UpdateIssueBody, UpdateIssueStatusBody } from '../dto/update-issue.dto';

@Controller('issues')
@ApiUseTags('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('')
  @Scopes(PermissionScopes.WriteIssue)
  @ApiOkResponse({ type: IssueEntity })
  createIssue(
    @Body()
    { name, description, assigneeId, reporterId, epicId, storyPoint, priority, type, labelIds, sprintId, projectId }: CreateIssueBody,
    @User() { userId }: UserSession,
  ) {
    return this.issueService.createIssue(
      userId,
      name,
      description,
      assigneeId,
      reporterId,
      projectId,
      epicId,
      sprintId,
      labelIds,
      storyPoint,
      priority,
      type,
    );
  }

  @Get(':id')
  @Scopes(PermissionScopes.ReadIssue)
  @ApiOkResponse({ type: IssueEntity })
  getOneIssue(@Param('id') issueId: number, @User() { userId }: UserSession) {
    return this.issueService.getOneIssue(issueId, userId);
  }

  @Get('')
  @Scopes(PermissionScopes.ReadIssue)
  @ApiOkResponse({ type: IssueEntity, isArray: true })
  getManyIssue(@Query() { projectId }: GetManyIssueQuery, @User() { userId }: UserSession) {
    return this.issueService.getManyIssues(projectId, userId);
  }

  @Put(':id')
  @Scopes(PermissionScopes.WriteIssue)
  @ApiOkResponse({ type: IssueEntity })
  updateIssue(
    @Param('id') issueId: number,
    @Body() { name, description, assigneeId, reporterId, epicId, sprintId, type, storyPoint, priority, labelIds }: UpdateIssueBody,
    @User() { userId }: UserSession,
  ) {
    return this.issueService.updateIssue(
      issueId,
      userId,
      name,
      description,
      assigneeId,
      reporterId,
      epicId,
      sprintId,
      type,
      storyPoint,
      priority,
      labelIds,
    );
  }

  @Put(':id/status')
  @Scopes(PermissionScopes.WriteIssue)
  @ApiOkResponse({ type: IssueEntity })
  updateIssueStatus(@Param('id') issueId: number, @Body() { status }: UpdateIssueStatusBody, @User() { userId }: UserSession) {
    return this.issueService.updateIssueStatus(issueId, userId, status)
  }

  @Delete(':id')
  @Scopes(PermissionScopes.WriteIssue)
  @ApiOkResponse({type: IssueEntity})
  deleteIssue(@Param('id') issueId: number, @User() {userId}: UserSession) {
    return this.issueService.deleteIssue(issueId, userId)
  }
}
