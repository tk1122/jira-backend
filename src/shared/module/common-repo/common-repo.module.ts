import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../feature/user/entity/user.entity';
import { RoleEntity } from '../../../feature/user/entity/role.entity';
import { PermissionEntity } from '../../../feature/user/entity/permission.entity';
import { ProjectEntity } from '../../../feature/project/entity/project.entity';
import { EpicEntity } from '../../../feature/epic/entity/epic.entity';
import { SprintEntity } from '../../../feature/sprint/entity/sprint.entity';
import { IssueEntity } from '../../../feature/issue/entity/issue.entity';
import { LabelEntity } from '../../../feature/issue/entity/label.entity';
import { CommonRepoService } from './common-repo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, ProjectEntity, EpicEntity, SprintEntity, IssueEntity, LabelEntity]),
  ],
  providers: [CommonRepoService],
  exports: [CommonRepoService],
})
export class CommonRepoModule {}
