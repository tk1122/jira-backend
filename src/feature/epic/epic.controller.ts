import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';
import { CreateEpicBody } from './dto/create-epic.dto';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';
import { EpicService } from './epic.service';
import { UpdateEpicBody } from './dto/update-epic.dto';
import { GetManyEpicsQuery } from './dto/get-epic.dto';

@Controller('epics')
@ApiUseTags('epics')
export class EpicController {
  constructor(private readonly epicService: EpicService) {}

  @Post('')
  @Scopes(PermissionScopes.WriteEpic)
  createEpic(@Body() { name, description, startDate, endDate, projectId }: CreateEpicBody, @User() { userId }: UserSession) {
    return this.epicService.createEpic(projectId, userId, name, description, startDate, endDate);
  }

  @Put(':id')
  @Scopes(PermissionScopes.WriteEpic)
  updateEpic(
    @Body() { name, description, startDate, endDate }: UpdateEpicBody,
    @User() { userId }: UserSession,
    @Param('id') epicId: number,
  ) {
    return this.epicService.updateEpic(epicId, userId, name, description, startDate, endDate);
  }

  @Get(':id')
  @Scopes(PermissionScopes.ReadEpic)
  getOneEpic(@Param('id') epicId: number, @User() { userId }: UserSession) {
    return this.epicService.getOneEpic(epicId, userId);
  }

  @Get('')
  @Scopes(PermissionScopes.ReadEpic)
  getManyEpic(@Query() { projectId }: GetManyEpicsQuery, @User() { userId }: UserSession) {
    return this.epicService.getManyEpic(projectId, userId);
  }
}
