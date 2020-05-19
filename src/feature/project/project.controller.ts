import {Body, Controller, Get, Param, Post, Put, Query} from "@nestjs/common";
import {ApiUseTags} from "@nestjs/swagger";
import {CreateProjectBody} from "./dto/create-project.dto";
import {Scopes} from "../../shared/decorator/scopes.decorator";
import {PermissionScopes} from "../user/entity/permission.entity";
import {ProjectService} from "./project.service";
import {User} from "../../shared/decorator/user.decorator";
import {UserSession} from "../../shared/interface/session.interface";
import {UpdateProjectBody} from "./dto/update-project.dto";
import {GetProjectsQuery} from "./dto/get-projects.dto";

@Controller('projects')
@ApiUseTags('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Get(':id')
    @Scopes(PermissionScopes.ReadProject)
    async getOneProject(@Param('id') projectId: number, @User() user: UserSession) {

    }

    @Get()
    @Scopes(PermissionScopes.ReadProject)
    async getManyProjects(@Query() getProjectsQuery: GetProjectsQuery, @User() user: UserSession) {
        return this.projectService.getProjects(user.userId, getProjectsQuery.name, getProjectsQuery.status, getProjectsQuery.page, getProjectsQuery.limit)
    }

    @Post('')
    @Scopes(PermissionScopes.WriteProject)
    async createProject(@Body() createProjectBody: CreateProjectBody, @User() user: UserSession) {
        return this.projectService.createProject(createProjectBody.name, createProjectBody.description, user.userId, createProjectBody.leaderId)
    }

    @Put(':id')
    @Scopes(PermissionScopes.WriteProject)
    async updateProject(@Body() updateProjectBody: UpdateProjectBody, @Param('id') projectId: number) {
        return this.projectService.updateProject(projectId, updateProjectBody.memberIds, updateProjectBody.name, updateProjectBody.description, updateProjectBody.status)
    }

}