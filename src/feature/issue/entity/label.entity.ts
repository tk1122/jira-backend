import { DefaultEntity } from '../../../shared/interface/default.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ProjectEntity } from '../../project/entity/project.entity';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Entity('label')
export class LabelEntity extends DefaultEntity {
  @ApiResponseModelProperty()
  @Column()
  name: string;

  @ManyToOne(
    () => ProjectEntity,
    p => p.labels,
  )
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ApiResponseModelProperty()
  @Column({ name: 'project_id' })
  projectId: number;

  constructor(name: string, projectId: number) {
    super();

    this.name = name;
    this.projectId = projectId;
  }
}
