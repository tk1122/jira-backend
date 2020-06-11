import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';
import { CreateSprintBody } from './dto/create-sprint.dto';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';
import { SprintService } from './sprint.service';
import { UpdateSprintBody } from './dto/update-sprint.dto';
import { GetManySprintQuery } from './dto/get-sprint.dto';
import { SprintEntity } from './entity/sprint.entity';
import { EpicEntity } from '../epic/entity/epic.entity';

@Controller('sprints')
@ApiUseTags('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post('')
  @Scopes(PermissionScopes.WriteSprint)
  @ApiOkResponse({ type: SprintEntity })
  createSprint(@Body() { name, description, projectId }: CreateSprintBody, @User() { userId }: UserSession) {
    return this.sprintService.createSprint(projectId, userId, name, description);
  }

  @Put(':id')
  @Scopes(PermissionScopes.WriteSprint)
  @ApiOkResponse({ type: SprintEntity })
  updateSprint(@Body() { name, description }: UpdateSprintBody, @Param('id') sprintId: number, @User() { userId }: UserSession) {
    return this.sprintService.updateSprint(sprintId, userId, name, description);
  }

  @Put(':id/start')
  @Scopes(PermissionScopes.WriteSprint)
  @ApiOkResponse({ type: SprintEntity })
  startSprint(@Param('id') sprintId: number, @User() { userId }: UserSession) {
    return this.sprintService.startSprint(sprintId, userId);
  }

  @Put(':id/finish')
  @Scopes(PermissionScopes.WriteSprint)
  @ApiOkResponse({ type: SprintEntity })
  finishSprint(@Param('id') sprintId: number, @User() { userId }: UserSession) {
    return this.sprintService.finishSprint(sprintId, userId);
  }

  @Get(':id')
  @Scopes(PermissionScopes.ReadSprint)
  @ApiOkResponse({ type: SprintEntity })
  getOneSprint(@Param('id') sprintId: number, @User() { userId }: UserSession) {
    return this.sprintService.getOneSprint(sprintId, userId);
  }

  @Get('')
  @Scopes(PermissionScopes.ReadSprint)
  @ApiOkResponse({ type: SprintEntity, isArray: true })
  getManySprints(@Query() { projectId }: GetManySprintQuery, @User() { userId }: UserSession) {
    return this.sprintService.getManySprints(projectId, userId);
  }

  @Delete(':id')
  @Scopes(PermissionScopes.WriteSprint)
  @ApiOkResponse({ type: SprintEntity })
  deleteSprint(@User() { userId }: UserSession, @Param('id') sprintId: number) {
    return this.sprintService.deleteSprint(sprintId, userId);
  }
}
