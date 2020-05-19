import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {DefaultEntity} from "../../../shared/interface/default.entity";
import {UserEntity} from "../../user/entity/user.entity";

@Entity({name: 'project'})
export class ProjectEntity extends DefaultEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    status: ProjectStatus

    @Column({name: 'entity_type', type: "tinyint"})
    entityType: ProjectEntityType

    @ManyToOne(() => UserEntity, u => u.manageProjects)
    @JoinColumn({name: 'pm_id'})
    pm: UserEntity

    @ManyToOne(() => UserEntity, u => u.leadProjects)
    @JoinColumn({name: 'leader_id'})
    leader: UserEntity

    @ManyToMany(() => UserEntity)
    @JoinTable({name: 'project_member'})
    members: UserEntity[]

    constructor(name: string, description: string, pm: UserEntity, leader: UserEntity) {
        super();

        this.name = name;
        this.description = description;
        this.leader = leader
        this.pm = pm;
        this.status = ProjectStatus.Pending;
        this.entityType = 0
    }
}

export enum ProjectStatus {
    Pending,
    InProgress,
    Done
}

export type ProjectEntityType = 0;
