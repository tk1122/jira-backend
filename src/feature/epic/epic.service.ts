import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpicEntity } from './entity/epic.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';

@Injectable()
export class EpicService {
  constructor(
    @InjectRepository(EpicEntity) private readonly epicRepo: Repository<EpicEntity>,
    private readonly projectService: ProjectService,
  ) {}

  async getEpicByIdOrFail(epicId: number) {
    try {
      return await this.epicRepo.findOneOrFail({ id: epicId });
    } catch (e) {
      throw new NotFoundException('Epic not found');
    }
  }

  async createEpic(projectId: number, userId: number, name: string, description: string, startDate: Date, endDate: Date) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannnot create epic for this project');
    }

    const epic = new EpicEntity(name, description, startDate, endDate, projectId);

    return this.epicRepo.save(epic);
  }

  async updateEpic(epicId: number, userId: number, name?: string, description?: string, startDate?: Date, endDate?: Date) {
    const epic = await this.getEpicByIdOrFail(epicId);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update this epic');
    }

    if (name !== undefined) {
      epic.name = name;
    }

    if (description !== undefined) {
      epic.description = description;
    }

    if (startDate !== undefined) {
      epic.startDate = startDate;
    }

    if (endDate !== undefined) {
      epic.endDate = endDate;
    }

    return this.epicRepo.save(epic);
  }

  async getOneEpic(epicId: number, userId: number) {
    const epic = await this.getEpicByIdOrFail(epicId);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get this epic');
    }

    return epic;
  }

  async getManyEpic(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get epics of this project');
    }

    return this.epicRepo.find({ project });
  }
}
