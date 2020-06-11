import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintEntity } from './entity/sprint.entity';
import { ProjectEntity } from '../project/entity/project.entity';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entity/user.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([SprintEntity, ProjectEntity, UserEntity]), ProjectModule, UserModule, NotificationModule],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService],
})
export class SprintModule {}
