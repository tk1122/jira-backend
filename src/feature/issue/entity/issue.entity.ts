import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, RelationId } from 'typeorm';
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

  @Column({ name: 'story_point' })
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
  @JoinColumn({ name: 'assignee_id' })
  assignee: UserEntity;

  @Column({ name: 'assignee_id' })
  assigneeId: number;

  @ManyToOne(
    () => UserEntity,
    u => u.reportedIssues,
  )
  @JoinColumn({ name: 'reporter_id' })
  reporter: UserEntity;

  @Column({ name: 'reporter_id' })
  reporterId: number;

  @ManyToOne(
    () => EpicEntity,
    e => e.issues,
  )
  @JoinColumn({ name: 'epic_id' })
  epic: EpicEntity;

  @Column({ name: 'epic_id' })
  epicId: number;

  @ManyToMany(() => LabelEntity)
  @JoinTable({
    name: 'issue_label',
    joinColumn: { name: 'issue_id' },
    inverseJoinColumn: { name: 'label_id' },
  })
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
    if (labels !== undefined) {
      this.labels = labels;
    }

    this.status = IssueStatus.Todo;
    this.entityType = 3;
  }
}

export type IssueEntityType = 3;
