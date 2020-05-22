import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entity/project.entity';
import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity } from '../user/entity/role.entity';
import { EpicModule } from '../epic/epic.module';
import { CommonRepoModule } from '../../shared/module/common-repo/common-repo.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, RoleEntity]), EpicModule, CommonRepoModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
