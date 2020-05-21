import { Module } from '@nestjs/common';
import { EpicController } from './epic.controller';
import { EpicService } from './epic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpicEntity } from './entity/epic.entity';
import { ProjectEntity } from '../project/entity/project.entity';
import { CommonRepoModule } from '../../shared/module/common-repo/common-repo.module';

@Module({
  imports: [TypeOrmModule.forFeature([EpicEntity, ProjectEntity]), CommonRepoModule],
  controllers: [EpicController],
  providers: [EpicService],
  exports: [EpicService],
})
export class EpicModule {}
