import { Module } from '@nestjs/common';
import { EpicController } from './epic.controller';
import { EpicService } from './epic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpicEntity } from './entity/epic.entity';
import { ProjectEntity } from '../project/entity/project.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([EpicEntity, ProjectEntity]), ProjectModule],
  controllers: [EpicController],
  providers: [EpicService],
  exports: [EpicService],
})
export class EpicModule {}
