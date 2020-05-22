import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity, SprintStatus } from './entity/sprint.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(SprintEntity) private readonly sprintRepo: Repository<SprintEntity>,
    private readonly projectService: ProjectService,
  ) {}

  async getSprintByIdOrFail(sprintId: number) {
    try {
      return await this.sprintRepo.findOneOrFail({ id: sprintId });
    } catch (e) {
      throw new NotFoundException('Sprint not found');
    }
  }

  async createSprint(projectId: number, userId: number, name: string, description: string) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create sprint for this project');
    }

    const sprint = new SprintEntity(name, description, projectId);

    return this.sprintRepo.save(sprint);
  }

  async updateSprint(sprintId: number, userId: number, name?: string, description?: string) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    if (!(await this.canUserEditSprint(userId, sprint))) {
      throw new BadRequestException('You cannot update this sprint');
    }

    if (name !== undefined) {
      sprint.name = name;
    }

    if (description !== undefined) {
      sprint.description = description;
    }

    return this.sprintRepo.save(sprint);
  }

  async startSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    if (!(await this.canUserEditSprint(userId, sprint))) {
      throw new BadRequestException('You cannot start this sprint');
    }

    if (sprint.status !== SprintStatus.Pending) {
      throw new BadRequestException('This sprint is not currently waiting to start');
    }

    const otherSprintsOfProjects = await this.sprintRepo.find({ projectId: sprint.projectId });

    if (otherSprintsOfProjects.map(s => s.status).includes(SprintStatus.InProgress)) {
      throw new BadRequestException('Each project has only one active sprint');
    }

    sprint.startTime = new Date();
    sprint.status = SprintStatus.InProgress;

    return this.sprintRepo.save(sprint);
  }

  async finishSprint(sprintId: number, userId: number) {
    const sprint = await this.sprintRepo.findOneOrFail({ id: sprintId });

    if (!(await this.canUserEditSprint(userId, sprint))) {
      throw new BadRequestException('You cannot finish this sprint');
    }

    if (sprint.status !== SprintStatus.Pending) {
      throw new BadRequestException('This sprint is not currently active');
    }

    sprint.finishTime = new Date();
    sprint.status = SprintStatus.Finished;

    return this.sprintRepo.save(sprint);
  }

  async getOneSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot read this sprint');
    }

    return sprint;
  }

  async getManySprints(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You are not a member of this project');
    }

    return this.sprintRepo.find({ project });
  }

  private async canUserEditSprint(userId: number, sprint: SprintEntity) {
    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    return this.projectService.isLeaderOfProject(userId, project);
  }
}
