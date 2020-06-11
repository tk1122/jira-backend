import { BadRequestException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserStatus } from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '../../shared/module/config/config.service';
import { RoleEntity, Roles } from './entity/role.entity';
import { PermissionEntity, PermissionScopes } from './entity/permission.entity';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.initPermissions();
    await this.initRoles();
    await this.initAdmin();
  }

  async getUserByIdOrFail(userId: number) {
    try {
      return await this.userRepo.findOneOrFail({ id: userId });
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async create(
    username: string,
    password: string,
    otherInfo?: Pick<UserEntity, 'age' | 'email' | 'fullname' | 'gender'>,
    isAdmin?: boolean,
  ) {
    const existingUser = await this.userRepo.findOne({ username });
    if (existingUser) {
      this.logger.error(`Username ${username} already taken`, Error().stack, 'UserService:create');
      throw new BadRequestException('Username already taken');
    }
    let user = new UserEntity();
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    user.username = username;
    user.password = hashedPassword;
    user.status = isAdmin ? UserStatus.Activated : UserStatus.Unactivated;
    user.age = otherInfo?.age;
    user.email = otherInfo?.email;
    user.fullname = otherInfo?.fullname;
    user.gender = otherInfo?.gender;

    if (isAdmin) {
      const adminRole = await this.roleRepo.findOne({ name: Roles.Admin });
      user.roles = adminRole ? [adminRole] : [];
    } else {
      const guestRole = await this.roleRepo.findOne({ name: Roles.Guest });
      user.roles = guestRole ? [guestRole] : [];
    }

    await this.userRepo.save(user);

    return {
      success: true,
    };
  }

  async getOneById(id: number) {
    return await this.userRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.password', 'r.name', 'u.username', 'r.id'])
      .addSelect('u.password')
      .where('u.id = :id', { id })
      .innerJoin('u.roles', 'r')
      .getOne();
  }

  async getOneByUsername(username: string) {
    return await this.userRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.password', 'r.name', 'u.username', 'r.id', 'u.status'])
      .addSelect('u.password')
      .where('u.username = :username', { username })
      .innerJoin('u.roles', 'r')
      .getOne();
  }

  async getUsers(username: string = '', page: number = 1, limit: number = 10, fetchOnlyActiveUsers = true) {
    const getUsersQuery = this.userRepo
      .createQueryBuilder('u')
      .where('u.username LIKE :username', { username: `${username}%` })
      .andWhere('u.username != :admin', { admin: this.configService.get('ADMIN_USERNAME') })
      .skip((page - 1) * limit)
      .take(limit);

    if (fetchOnlyActiveUsers) {
      getUsersQuery.andWhere('u.status = :activeStatus', { activeStatus: UserStatus.Activated });
    }

    return getUsersQuery.getMany();
  }

  async getRoles() {
    return this.roleRepo.find({ name: Not(Roles.Admin) });
  }

  async getOneUser(userId: number) {
    const user = await this.userRepo.findOne({ id: userId, username: Not(this.configService.get('ADMIN_USERNAME')) });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    userId: number,
    roleIds: number[] | undefined,
    status: UserStatus | null | undefined,
    skill: string | null | undefined,
    level: string | null | undefined,
  ) {
    const user = await this.getUserByIdOrFail(userId);

    user.status = status ?? user.status;
    user.skill = skill ?? user.skill;
    user.level = level ?? user.level;

    const roles = roleIds
      ? await this.roleRepo
          .createQueryBuilder('r')
          .select(['r'])
          .where('r.id IN (:...roleIds)', { roleIds })
          .andWhere('r.name != :adminRole', { adminRole: Roles.Admin })
          .getMany()
      : undefined;

    if (roles) {
      user.roles = roles;
    }

    return this.userRepo.save(user);
  }

  private async initAdmin() {
    const adminUsername = this.configService.get('ADMIN_USERNAME');
    const adminPassword = this.configService.get('ADMIN_PASSWORD');

    const user = await this.getOneByUsername(adminUsername);

    if (!user) {
      return this.create(adminUsername, adminPassword, undefined, true);
    }
  }

  private async initPermissions() {
    let permissions = await this.permissionRepo.findOne();
    if (!permissions) {
      await Promise.all([
        Object.values(PermissionScopes).map(value => {
          const permission = new PermissionEntity();
          permission.scope = value;
          return this.permissionRepo.save(permission);
        }),
      ]);
    }
  }

  private async initRoles() {
    if (!(await this.roleRepo.findOne())) {
      const adminPermission = (
        await Promise.all([
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadUser } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteUser } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadRole } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteRole } }),
        ])
      ).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

      const pmPermissions = (
        await Promise.all([
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadEpic } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteEpic } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadProject } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteProject } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadSprint } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadIssue } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadUser } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadRole } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteNotification } }),
        ])
      ).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

      const leaderPermissions = (
        await Promise.all([
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadSprint } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteSprint } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadIssue } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteIssue } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadProject } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadUser } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadEpic } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadRole } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteNotification } }),
        ])
      ).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

      const memberPermissions = (
        await Promise.all([
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadSprint } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadIssue } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteIssue } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadProject } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadUser } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadEpic } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.ReadRole } }),
          this.permissionRepo.findOne({ where: { scope: PermissionScopes.WriteNotification } }),
        ])
      ).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

      await Promise.all([
        this.roleRepo.save({ name: Roles.Admin, permissions: adminPermission }),
        this.roleRepo.save({ name: Roles.PM, permissions: pmPermissions }),
        this.roleRepo.save({ name: Roles.Leader, permissions: leaderPermissions }),
        this.roleRepo.save({ name: Roles.Member, permissions: memberPermissions }),
        this.roleRepo.save({ name: Roles.Guest }),
      ]);
    }
  }
}
