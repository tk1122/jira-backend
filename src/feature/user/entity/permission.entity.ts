import {Column, Entity} from "typeorm";
import {DefaultEntity} from "../../../shared/interface/default.entity";
import {ApiModelProperty} from "@nestjs/swagger";

@Entity({name: 'permission'})
export class PermissionEntity extends DefaultEntity {
    @ApiModelProperty()
    @Column()
    scope: PermissionScopes
}

export enum PermissionScopes {
    ReadUser = 'read_user',
    WriteUser = 'write_user',
    ReadProject = 'read_project',
    WriteProject = 'write_project',
    ReadEpic = 'read_epic',
    WriteEpic = 'write_epic',
    ReadIssue = 'read_issue',
    WriteIssue = 'write_issue',
    ReadSprint = 'read_sprint',
    WriteSprint = 'write_sprint',
    ReadRole = 'read_role',
    WriteRole = 'write_role'
}
