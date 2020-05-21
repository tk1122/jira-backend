import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from './entity/issue.entity';
import { LabelEntity } from './entity/label.entity';
import { EpicEntity } from '../epic/entity/epic.entity';
import { SprintEntity } from '../sprint/entity/sprint.entity';
import { ProjectEntity } from '../project/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity, LabelEntity, EpicEntity, SprintEntity, ProjectEntity])],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
