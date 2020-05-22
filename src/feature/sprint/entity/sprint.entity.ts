import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { ApiResponseModelProperty } from '@nestjs/swagger';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity('sprint')
export class SprintEntity extends DefaultEntity {
  @ApiResponseModelProperty()
  @Column()
  name: string;

  @ApiResponseModelProperty()
  @Column()
  description: string;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', name: 'start_time', nullable: true })
  startTime: Date;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', name: 'finish_time', nullable: true })
  finishTime: Date;

  @ApiResponseModelProperty()
  @Column({ name: 'total_story_point' })
  totalStoryPoint: number;

  @ApiResponseModelProperty()
  @Column({ type: 'tinyint' })
  status: SprintStatus;

  @ApiResponseModelProperty()
  @Column({ type: 'tinyint', name: 'entity_type' })
  entityType: SprintEntityType;

  @ManyToOne(
    () => ProjectEntity,
    p => p.sprints,
  )
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ApiResponseModelProperty()
  @Column({ name: 'project_id' })
  projectId: number;

  @OneToMany(
    () => IssueEntity,
    i => i.sprint,
  )
  issues: IssueEntity[];

  constructor(name: string, description: string, projectId: number) {
    super();

    this.name = name;
    this.description = description;
    this.projectId = projectId;
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
