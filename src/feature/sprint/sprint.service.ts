import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity, SprintStatus } from './entity/sprint.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../project/entity/project.entity';
import { EpicService } from '../epic/epic.service';
import { CommonRepoService } from '../../shared/module/common-repo/common-repo.service';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(SprintEntity) private readonly sprintRepo: Repository<SprintEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    private readonly epicService: EpicService,
    private readonly commonRepo: CommonRepoService,
  ) {}

  private isLeaderOfProject(userId: number, project: ProjectEntity) {
    return project.leaderId === userId;
  }

  private async canUserEditSprint(userId: number, sprint: SprintEntity) {
    const project = await this.commonRepo.getProjectByIdOrFail(sprint.projectId);

    return this.isLeaderOfProject(userId, project);
  }

  async createSprint(projectId: number, userId: number, name: string, description: string) {
    const project = await this.commonRepo.getProjectByIdOrFail(projectId);

    if (!this.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create sprint for this project');
    }

    const sprint = new SprintEntity(name, description, projectId);

    return this.sprintRepo.save(sprint);
  }

  async updateSprint(sprintId: number, userId: number, name?: string, description?: string) {
    const sprint = await this.commonRepo.getSprintByIdOrFail(sprintId);

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
    const sprint = await this.commonRepo.getSprintByIdOrFail(sprintId);

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
    const sprint = await this.commonRepo.getSprintByIdOrFail(sprintId);

    const project = await this.commonRepo.getProjectByIdOrFail(sprint.projectId);

    if (!this.epicService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot read this sprint');
    }

    return sprint;
  }

  async getManySprints(projectId: number, userId: number) {
    const project = await this.commonRepo.getProjectByIdOrFail(projectId);

    if (!this.epicService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You are not a member of this project');
    }

    return this.sprintRepo.find({ project });
  }
}
