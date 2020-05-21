import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpicEntity } from '../../../feature/epic/entity/epic.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../../feature/project/entity/project.entity';
import { SprintEntity } from '../../../feature/sprint/entity/sprint.entity';

@Injectable()
export class CommonRepoService {
  constructor(
    @InjectRepository(EpicEntity) private readonly epicRepo: Repository<EpicEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(SprintEntity) private readonly sprintRepo: Repository<SprintEntity>,
  ) {}

  async getProjectByIdOrFail(projectId: number) {
    try {
      return await this.projectRepo.findOneOrFail({ id: projectId });
    } catch (e) {
      throw new NotFoundException('Project not found');
    }
  }

  async getEpicByIdOrFail(epicId: number) {
    try {
      return await this.epicRepo.findOneOrFail({ id: epicId });
    } catch (e) {
      throw new NotFoundException('Epic not found');
    }
  }

  async getSprintByIdOrFail(sprintId: number) {
    try {
      return await this.sprintRepo.findOneOrFail({ id: sprintId });
    } catch (e) {
      throw new NotFoundException('Sprint not found');
    }
  }
}
