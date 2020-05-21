import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { SprintEntity } from '../../sprint/entity/sprint.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: ProjectStatus;

  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: ProjectEntityType;

  @ManyToOne(
    () => UserEntity,
    u => u.manageProjects,
  )
  @JoinColumn({ name: 'pm_id' })
  pm: UserEntity;

  @Column({ name: 'pm_id' })
  pmId: number;

  @ManyToOne(
    () => UserEntity,
    u => u.leadProjects,
  )
  @JoinColumn({ name: 'leader_id' })
  leader: UserEntity;

  @Column({ name: 'leader_id' })
  leaderId: number;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'project_member', joinColumn: { name: 'project_id' }, inverseJoinColumn: { name: 'member_id' } })
  members: UserEntity[];

  @RelationId((project: ProjectEntity) => project.members)
  memberIds: number[];

  @OneToMany(
    () => EpicEntity,
    e => e.project,
  )
  epics: EpicEntity[];

  @OneToMany(
    () => SprintEntity,
    s => s.project,
  )
  sprints: SprintEntity[];

  constructor(name: string, description: string, pm: UserEntity, leader: UserEntity) {
    super();

    this.name = name;
    this.description = description;
    this.leader = leader;
    this.pm = pm;
    this.status = ProjectStatus.Pending;
    this.entityType = 0;
  }
}

export enum ProjectStatus {
  Pending,
  InProgress,
  Done,
}

export type ProjectEntityType = 0;
