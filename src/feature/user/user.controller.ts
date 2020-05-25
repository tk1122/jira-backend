import { Body, Controller, Get, Logger, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from './entity/permission.entity';
import { SetRoleBody } from './dto/set-role.dto';
import { GetUserQuery } from './dto/get-users.dto';
import { UpdateUserBody } from './dto/update-user.dto';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';
import { UserEntity } from './entity/user.entity';

// @ts-ignore

@ApiUseTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('')
  @Scopes(PermissionScopes.ReadUser)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUsers(@Query() getUsersQuery: GetUserQuery, @User() user: UserSession) {
    return this.userService.getUsers(getUsersQuery.username, getUsersQuery.page, getUsersQuery.limit, !user.isAdmin);
  }

  @Get('roles')
  @Scopes(PermissionScopes.ReadRole)
  async getRoles() {
    return this.userService.getRoles();
  }

  @Get(':id')
  @Scopes(PermissionScopes.ReadUser)
  @ApiOkResponse({ type: UserEntity })
  async getOneUser(@Param('id') userId: number) {
    return this.userService.getOneUser(userId);
  }

  @Put(':id/roles')
  @Scopes(PermissionScopes.WriteRole)
  async setRoles(@Body() setRoleBody: SetRoleBody, @Param('id') userId: number) {
    return this.userService.setRole(userId, setRoleBody.roleIds);
  }

  @Put(':id')
  @Scopes(PermissionScopes.WriteUser)
  async updateUser(@Body() updateUserBody: UpdateUserBody, @Param('id') userId: number) {
    return this.userService.updateUser(userId, {
      level: updateUserBody.level,
      status: updateUserBody.status,
      skill: updateUserBody.skill,
    });
  }
}
