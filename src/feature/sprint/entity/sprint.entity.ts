import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { ProjectEntity } from '../../project/entity/project.entity';

@Entity('sprint')
export class SprintEntity extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', name: 'start_time', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'finish_time', nullable: true })
  finishTime: Date;

  @Column({ name: 'total_story_point' })
  totalStoryPoint: number;

  @Column({ type: 'tinyint' })
  status: SprintStatus;

  @Column({ type: 'tinyint', name: 'entity_type' })
  entityType: SprintEntityType;

  @ManyToOne(
    () => ProjectEntity,
    p => p.sprints,
  )
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column({name: 'project_id'})
  projectId: number

  constructor(name: string, description: string, project: ProjectEntity) {
    super();

    this.name = name;
    this.description = description;
    this.project = project;
    this.status = SprintStatus.Pending;
    this.totalStoryPoint = 0;
    this.entityType = 2;
  }
}

export enum SprintStatus {
  Pending,
  InProgress,
  Finished,
}

type SprintEntityType = 2;
