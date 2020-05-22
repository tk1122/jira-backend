import { Module } from '@nestjs/common';
import { IssueController } from './controller/issue.controller';
import { IssueService } from './issue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from './entity/issue.entity';
import { LabelEntity } from './entity/label.entity';
import { ProjectModule } from '../project/project.module';
import { SprintModule } from '../sprint/sprint.module';
import { EpicModule } from '../epic/epic.module';
import { UserModule } from '../user/user.module';
import { LabelController } from './controller/label.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity, LabelEntity]), ProjectModule, SprintModule, EpicModule, UserModule],
  controllers: [IssueController, LabelController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
