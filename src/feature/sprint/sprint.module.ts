import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintEntity } from './entity/sprint.entity';
import { ProjectEntity } from '../project/entity/project.entity';
import { EpicModule } from '../epic/epic.module';
import { CommonRepoModule } from '../../shared/module/common-repo/common-repo.module';

@Module({
  imports: [TypeOrmModule.forFeature([SprintEntity, ProjectEntity]), EpicModule, CommonRepoModule],
  controllers: [SprintController],
  providers: [SprintService],
})
export class SprintModule {}
