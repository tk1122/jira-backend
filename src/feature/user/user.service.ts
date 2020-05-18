import {BadRequestException, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity, UserStatus} from './entity/user.entity';
import {Repository} from 'typeorm';
import {genSalt, hash} from 'bcrypt';
import {ConfigService} from '../../shared/module/config/config.service';
import {RoleEntity, Roles} from "./entity/role.entity";
import {PermissionEntity, PermissionScopes} from "./entity/permission.entity";

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
    ) {
    }

    async onApplicationBootstrap() {
        await this.initPermissions()
        await this.initRoles()
        await this.initAdmin()
    }

    async create(username: string, password: string, otherInfo?: Pick<UserEntity, 'age' | 'email' | 'fullname' | 'gender' | 'level' | 'skill'>, isAdmin?: boolean) {
        const existingUser = await this.userRepo.findOne({username});
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
        user.age = otherInfo?.age
        user.email = otherInfo?.email
        user.fullname = otherInfo?.fullname
        user.gender = otherInfo?.gender
        user.level = otherInfo?.level
        user.skill = otherInfo?.skill

        if (isAdmin) {
            const adminRole = await this.roleRepo.findOne({name: Roles.Admin})
            user.roles = adminRole ? [adminRole] : []
        }

        return this.userRepo.save(user);
    }

    async getOneById(id: number) {
        return await this.userRepo
            .createQueryBuilder('u')
            .select(['u.id', 'u.password', 'r.name', 'u.username', 'r.id'])
            .addSelect('u.password')
            .where('u.id = :id', {id})
            .innerJoin('u.roles', 'r')
            .getOne();
    }

    async getOneByUsername(username: string) {
        return await this.userRepo
            .createQueryBuilder('u')
            .select(['u.id', 'u.password', 'r.name', 'u.username', 'r.id'])
            .addSelect('u.password')
            .where('u.username = :username', {username})
            .innerJoin('u.roles', 'r')
            .getOne();
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
            await Promise.all([Object.values(PermissionScopes).map((value) => {
                console.log(value)
                const permission = new PermissionEntity();
                permission.scope = value;
                return this.permissionRepo.save(permission);
            })])
        }
    }

    private async initRoles() {
        if (!await this.roleRepo.findOne()) {
            const adminPermission = (await Promise.all([
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadUser}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteUser}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadRole}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteRole}})
            ])).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

            const pmPermissions = (await Promise.all([
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadEpic}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteEpic}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadProject}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteProject}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadSprint}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadIssue}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadUser}}),
            ])).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

            const leaderPermissions = (await Promise.all([
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadSprint}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteSprint}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadIssue}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteIssue}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadProject}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadUser}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadEpic}}),
            ])).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

            const memberPermissions = (await Promise.all([
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadSprint}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadIssue}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.WriteIssue}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadProject}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadUser}}),
                this.permissionRepo.findOne({where: {scope: PermissionScopes.ReadEpic}}),
            ])).filter((permission): permission is Required<PermissionEntity> => permission != undefined);

            const a = await Promise.all([
                this.roleRepo.save({name: Roles.Admin, permissions: adminPermission}),
                this.roleRepo.save({name: Roles.PM, permissions: pmPermissions}),
                this.roleRepo.save({name: Roles.Leader, permissions: leaderPermissions}),
                this.roleRepo.save({name: Roles.Member, permissions: memberPermissions}),
                this.roleRepo.save({name: Roles.Guest}),
            ]);
        }
    }
}
