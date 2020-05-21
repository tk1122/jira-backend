import {Body, Controller, Get, Param, Post, Put, Query} from "@nestjs/common";
import {ApiUseTags} from "@nestjs/swagger";
import {Scopes} from "../../shared/decorator/scopes.decorator";
import {PermissionScopes} from "../user/entity/permission.entity";
import {CreateSprintBody} from "./dto/create-sprint.dto";
import {User} from "../../shared/decorator/user.decorator";
import {UserSession} from "../../shared/interface/session.interface";
import {SprintService} from "./sprint.service";
import {UpdateSprintBody} from "./dto/update-sprint.dto";
import {GetManySprintQuery} from "./dto/get-sprint.dto";

@Controller('sprints')
@ApiUseTags('sprints')
export class SprintController {
    constructor(private readonly sprintService: SprintService) {
    }

    @Post('')
    @Scopes(PermissionScopes.WriteSprint)
    createSprint(@Body() {name, description, projectId}: CreateSprintBody, @User() {userId}: UserSession) {
        return this.sprintService.createSprint(projectId, userId, name, description)
    }

    @Put(':id')
    @Scopes(PermissionScopes.WriteSprint)
    updateSprint(@Body() {name, description}: UpdateSprintBody, @Param('id') sprintId: number, @User() {userId}: UserSession) {
        return this.sprintService.updateSprint(sprintId, userId, name, description)
    }

    @Put(':id/start')
    @Scopes(PermissionScopes.WriteSprint)
    startSprint(@Param('id') sprintId: number, @User() {userId}: UserSession) {
        return this.sprintService.startSprint(sprintId, userId)
    }

    @Put(':id/finish')
    @Scopes(PermissionScopes.WriteSprint)
    finishSprint(@Param('id') sprintId: number, @User() {userId}: UserSession) {
        return this.sprintService.finishSprint(sprintId, userId)
    }

    @Get(':id')
    @Scopes(PermissionScopes.ReadSprint)
    getOneSprint(@Param('id') sprintId: number, @User() {userId}: UserSession) {
        return this.sprintService.getOneSprint(sprintId, userId)
    }

    @Get('')
    @Scopes(PermissionScopes.ReadSprint)
    getManySprints(@Query() {projectId}: GetManySprintQuery, @User() {userId}: UserSession) {
        return this.sprintService.getManySprints(projectId, userId)
    }
 }
