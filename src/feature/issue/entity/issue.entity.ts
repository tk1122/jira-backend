import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { LabelEntity } from './label.entity';
import { ApiResponseModelProperty } from '@nestjs/swagger';
import { SprintEntity } from '../../sprint/entity/sprint.entity';
import { ProjectEntity } from '../../project/entity/project.entity';

export enum IssueStatus {
  Todo,
  Doing,
  Testing,
  Done,
}

export enum IssuePriority {
  Low,
  Medium,
  High,
}

export enum IssueType {
  Story,
  Task,
  Bug,
}

@Entity('issue')
export class IssueEntity extends DefaultEntity {
  @ApiResponseModelProperty()
  @Column()
  name: string;

  @Column()
  @ApiResponseModelProperty()
  description: string;

  @Column({ name: 'entity_type', type: 'tinyint' })
  @ApiResponseModelProperty()
  entityType: IssueEntityType;

  @Column({ name: 'story_point' })
  @ApiResponseModelProperty()
  storyPoint: number;

  @Column({ type: 'tinyint' })
  @ApiResponseModelProperty()
  status: IssueStatus;

  @Column({ type: 'tinyint' })
  @ApiResponseModelProperty()
  priority: IssuePriority;

  @Column({ type: 'tinyint' })
  @ApiResponseModelProperty()
  type: IssueType;

  @ManyToOne(
    () => UserEntity,
    u => u.assignedIssues,
  )
  @JoinColumn({ name: 'assignee_id' })
  assignee: UserEntity;

  @Column({ name: 'assignee_id' })
  @ApiResponseModelProperty()
  assigneeId: number;

  @ManyToOne(
    () => UserEntity,
    u => u.reportedIssues,
  )
  @JoinColumn({ name: 'reporter_id' })
  reporter: UserEntity;

  @Column({ name: 'reporter_id' })
  @ApiResponseModelProperty()
  reporterId: number;

  @ManyToOne(
    () => ProjectEntity,
    p => p.issues,
  )
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column({ name: 'project_id' })
  @ApiResponseModelProperty()
  projectId: number;

  @ManyToOne(
    () => EpicEntity,
    e => e.issues,
    { nullable: true },
  )
  @JoinColumn({ name: 'epic_id' })
  epic?: EpicEntity;

  @Column({ name: 'epic_id', nullable: true })
  @ApiResponseModelProperty()
  epicId?: number;

  @ManyToOne(
    () => SprintEntity,
    s => s.issues,
    { nullable: true },
  )
  @JoinColumn({ name: 'sprint_id' })
  sprint?: SprintEntity;

  @Column({ name: 'sprint_id', nullable: true })
  @ApiResponseModelProperty()
  sprintId?: number;

  @ManyToMany(() => LabelEntity)
  @JoinTable({
    name: 'issue_label',
    joinColumn: { name: 'issue_id' },
    inverseJoinColumn: { name: 'label_id' },
  })
  labels: LabelEntity[];

  @ApiResponseModelProperty()
  @RelationId((issue: IssueEntity) => issue.labels)
  labelIds: number[];

  constructor(
    name: string,
    description: string,
    assignee: UserEntity,
    reporter: UserEntity,
    project: ProjectEntity,
    epic?: EpicEntity,
    sprint?: SprintEntity,
    labels?: LabelEntity[],
    storyPoint?: number,
    priority?: IssuePriority,
    type?: IssueType,
  ) {
    super();

    this.name = name;
    this.description = description;
    this.assignee = assignee;
    this.reporter = reporter;
    this.project = project;

    this.epic = epic;
    this.sprint = sprint;
    if (labels) {
      this.labels = labels;
    }

    this.storyPoint = storyPoint ?? 0;
    this.priority = priority ?? IssuePriority.Medium;
    this.type = type ?? IssueType.Task;

    this.status = IssueStatus.Todo;
    this.entityType = 3;
  }
}

export type IssueEntityType = 3;
