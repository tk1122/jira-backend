import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {DefaultEntity} from "../../../shared/interface/default.entity";
import {PermissionEntity} from "./permission.entity";
import {ApiModelProperty} from "@nestjs/swagger";

@Entity({name: 'role'})
export class RoleEntity extends DefaultEntity {
    @ApiModelProperty()
    @Column()
    name: string

    @ApiModelProperty()
    @ManyToMany(() => PermissionEntity, {nullable: true})
    @JoinTable({name: 'role_permission'})
    permissions: PermissionEntity[]
}

export enum Roles {
    Guest = 'guest',
    Member = 'member',
    PM = 'pm',
    Leader = 'leader',
    Admin = 'admin'
}
