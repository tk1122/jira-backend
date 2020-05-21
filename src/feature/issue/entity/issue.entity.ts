import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { LabelEntity } from './label.entity';

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
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: IssueEntityType;

  @Column()
  storyPoint: number;

  @Column({ type: 'tinyint' })
  status: IssueStatus;

  @Column({ type: 'tinyint' })
  priority: IssuePriority;

  @Column({ type: 'tinyint' })
  type: IssueType;

  @ManyToOne(
    () => UserEntity,
    u => u.assignedIssues,
  )
  assignee: UserEntity;

  @ManyToOne(
    () => UserEntity,
    u => u.reportedIssues,
  )
  reporter: UserEntity;

  @ManyToOne(
    () => EpicEntity,
    e => e.issues,
  )
  epic: EpicEntity;

  @ManyToMany(() => IssueEntity)
  @JoinTable({ name: 'issue_label' })
  labels: LabelEntity[];

  constructor(
    name: string,
    description: string,
    assignee: UserEntity,
    reporter: UserEntity,
    epic: EpicEntity,
    storyPoint?: number,
    priority?: IssuePriority,
    type?: IssueType,
    labels?: LabelEntity[],
  ) {
    super();

    this.name = name;
    this.description = description;
    this.assignee = assignee;
    this.reporter = reporter;
    this.epic = epic;

    this.storyPoint = storyPoint ?? 0;
    this.priority = priority ?? IssuePriority.Medium;
    this.type = type ?? IssueType.Task;
    this.labels = labels ?? [];

    this.status = IssueStatus.Todo;
    this.entityType = 3;
  }
}

export type IssueEntityType = 3;
