import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user/user.service';
import {compare} from 'bcrypt';
import {JWTPayload,} from '../../shared/interface/session.interface';
import {InjectRepository} from "@nestjs/typeorm";
import {PermissionEntity} from "../user/entity/permission.entity";
import {Repository} from "typeorm";
import {RoleEntity} from "../user/entity/role.entity";
import {UserEntity, UserStatus} from "../user/entity/user.entity";
import {ConfigService} from "../../shared/module/config/config.service";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(PermissionEntity)
        private readonly permissionRepo: Repository<PermissionEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepo: Repository<RoleEntity>,
        private readonly configService: ConfigService
    ) {
    }

    async getPermissionsByUserId(userId: number) {
        return this.userRepo.createQueryBuilder('u')
            .innerJoinAndSelect('u.roles', 'r')
            .innerJoinAndSelect('r.permissions', 'p')
            .where('u.id = :userId', {userId})
            .getOne()
    }

    async createSession(username: string, password: string): Promise<JWTPayload & { accessToken: string }> {
        const user = await this.userService.getOneByUsername(username);


        if (!user) {
            this.logger.error(
                `Can not find user with username ${username}`,
                Error().stack,
                'AuthService:createSession',
            );
            throw new UnauthorizedException('Invalid username or password');
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            this.logger.error(
                `Password is incorrect with ${username}`,
                Error().stack,
                'AuthService:createSession',
            );
            throw new UnauthorizedException('Invalid username or password');
        }

        if (user.status === UserStatus.Unactivated) {
            // TODO: log
            throw new UnauthorizedException('Your account need to be accepted by admin');
        }

        if (user.status === UserStatus.Blocked) {
            // TODO: log
            throw new UnauthorizedException('Your account is currently blocked');
        }

        const jwtPayload: JWTPayload = {
            isAdmin: user.username === this.configService.get('ADMIN_USERNAME'),
            userId: user.id,
            username: user.username,
            roles: user.roles.map(r => r.id)
        }

        const accessToken = await this.jwtService.sign(jwtPayload);

        return {
            ...jwtPayload,
            accessToken
        }
    }

    async register() {

    }
}
