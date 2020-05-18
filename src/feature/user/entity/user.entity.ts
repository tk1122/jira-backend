import {Column, Entity, JoinTable, ManyToMany} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {DefaultEntity} from "../../../shared/interface/default.entity";
import {RoleEntity} from "./role.entity";

@Entity('user')
export class UserEntity extends DefaultEntity {
    @ApiModelProperty()
    @Column()
    username: string

    @ApiModelProperty()
    @Column({nullable: true})
    fullname?: string

    @ApiModelProperty()
    @Column({
        type: "tinyint",
    })
    status: UserStatus

    @ApiModelProperty()
    @Column({
        select: false,
    })
    password: string;

    @ApiModelProperty()
    @Column({nullable: true})
    email?: string;

    @ApiModelProperty()
    @Column({nullable: true})
    skill?: string

    @ApiModelProperty()
    @Column({nullable: true})
    level?: string

    @ApiModelProperty()
    @Column({nullable: true})
    age?: number

    @ApiModelProperty()
    @Column({type: "tinyint", nullable: true})
    gender?: UserGender

    @ApiModelProperty()
    @ManyToMany(() => RoleEntity)
    @JoinTable({name: 'user_role'})
    roles: RoleEntity[]
}

export enum UserStatus {
    Unactivated,
    Activated,
    Blocked
}

export enum UserGender {
    Male,
    Female,
    Others
}
