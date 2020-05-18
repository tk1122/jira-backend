import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entity/user.entity';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {RoleEntity} from "./entity/role.entity";
import {PermissionEntity} from "./entity/permission.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
