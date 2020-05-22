import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { IssueEntity } from '../../issue/entity/issue.entity';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Entity('epic')
export class EpicEntity extends DefaultEntity {
  @ApiResponseModelProperty()
  @Column()
  name: string;

  @ApiResponseModelProperty()
  @Column()
  description: string;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @ApiResponseModelProperty()
  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @ApiResponseModelProperty()
  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: EpicEntityType;

  @ManyToOne(
    () => ProjectEntity,
    p => p.epics,
  )
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ApiResponseModelProperty()
  @Column({ name: 'project_id' })
  projectId: number;

  @OneToMany(
    () => IssueEntity,
    i => i.epic,
  )
  issues: IssueEntity[];

  constructor(name: string, description: string, startDate: Date, endDate: Date, projectId: number) {
    super();
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.projectId = projectId;
    this.entityType = 1;
  }
}

export type EpicEntityType = 1;
