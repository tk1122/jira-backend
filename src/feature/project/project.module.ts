import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entity/project.entity';
import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity } from '../user/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, RoleEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
