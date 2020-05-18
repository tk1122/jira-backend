import {Body, Controller, Get, Logger, Param, Put, Query} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiUseTags} from '@nestjs/swagger';
import {Scopes} from "../../shared/decorator/scopes.decorator";
import {PermissionScopes} from "./entity/permission.entity";
import {SetRoleBody} from "./dto/set-role.dto";
import {GetUserQuery} from "./dto/get-users.dto";
import {UpdateUserBody} from "./dto/update-user.dto";

// @ts-ignore

@ApiUseTags('users')
@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Get('')
    @Scopes(PermissionScopes.ReadUser)
    async getUsers(@Query() getUsersQuery: GetUserQuery) {
        return this.userService.getUsers(getUsersQuery.username, getUsersQuery.page, getUsersQuery.limit)
    }

    @Get('roles')
    @Scopes(PermissionScopes.ReadRole)
    async getRoles() {
        return this.userService.getRoles();
    }

    @Put(':id/roles')
    @Scopes(PermissionScopes.WriteRole)
    async setRoles(@Body() setRoleBody: SetRoleBody, @Param('id') userId: number) {
        return this.userService.setRole(userId, setRoleBody.roleIds)
    }

    @Put(':id')
    @Scopes(PermissionScopes.WriteUser)
    async updateUser(@Body() updateUserBody: UpdateUserBody, @Param('id') userId: number) {
        return this.userService.updateUser(userId, {
            level: updateUserBody.level,
            status: updateUserBody.status,
            skill: updateUserBody.skill
        })
    }

}
