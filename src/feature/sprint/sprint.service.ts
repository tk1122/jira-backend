import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity, SprintStatus } from './entity/sprint.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../project/entity/project.entity';
import { EpicService } from '../epic/epic.service';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(SprintEntity) private readonly sprintRepo: Repository<SprintEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    private readonly epicService: EpicService,
  ) {}

  async createSprint(projectId: number, userId: number, name: string, description: string) {
    const project = await this.projectRepo
      .createQueryBuilder('p')
      .select(['p.id', 'l.id'])
      .leftJoin('p.leader', 'l')
      .where('p.id = :projectId', { projectId })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project?.leader?.id !== userId) {
      throw new UnauthorizedException('You cannot create sprint for this project');
    }

    const sprint = new SprintEntity(name, description, project);

    return this.sprintRepo.save(sprint);
  }

  async updateSprint(sprintId: number, userId: number, name?: string, description?: string) {
    const sprint = await this.canUserEditSprint(sprintId, userId);

    if (name !== undefined) {
      sprint.name = name;
    }

    if (description !== undefined) {
      sprint.description = description;
    }

    return this.sprintRepo.save(sprint);
  }

  async startSprint(sprintId: number, userId: number) {
    const sprint = await this.canUserEditSprint(sprintId, userId);

    if (sprint.status !== SprintStatus.Pending) {
      throw new BadRequestException('Cannot start this sprint');
    }

    const otherSprintsOfProjects = await this.sprintRepo
      .createQueryBuilder('s')
      .select(['s.status'])
      .innerJoin('s.project', 'p')
      .where('p.id = :projectId', { projectId: sprint?.project?.id })
      .getMany();

    if (otherSprintsOfProjects.map(s => s.status).includes(SprintStatus.InProgress)) {
      throw new BadRequestException('Each project has only one active sprint');
    }

    sprint.startTime = new Date();
    sprint.status = SprintStatus.InProgress;

    return this.sprintRepo.save(sprint);
  }

  async finishSprint(sprintId: number, userId: number) {
    const sprint = await this.canUserEditSprint(sprintId, userId);

    if (sprint.status !== SprintStatus.InProgress) {
      throw new BadRequestException('Cannot finish this sprint');
    }

    sprint.finishTime = new Date();
    sprint.status = SprintStatus.Finished;

    return this.sprintRepo.save(sprint);
  }

  async getOneSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintById(sprintId);

    const project = await this.projectRepo
      .createQueryBuilder('p')
      .select(['p.id', 'l.id', 'pm.id', 'm.id'])
      .leftJoin('p.leader', 'l')
      .leftJoin('p.pm', 'pm')
      .leftJoin('p.members', 'm')
      .where('p.id = :projectId', { projectId: sprint?.project?.id })
      .getOne();

    if (!project) {
      throw new NotFoundException('Sprint not belong to any project');
    }

    if (project?.leader?.id !== userId && project?.pm?.id !== userId && !project?.members.map(m => m?.id).includes(userId)) {
      throw new UnauthorizedException('You cannot read this sprint');
    }

    return sprint;
  }

  async getManySprints(projectId: number, userId: number) {
    const project = await this.epicService.getProjectById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!this.epicService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You are not a member of this project');
    }

    return this.sprintRepo.find({ project });
  }

  private async getSprintById(sprintId: number) {
    const sprint = await this.sprintRepo
      .createQueryBuilder('s')
      .select(['s', 'p.id'])
      .leftJoin('s.project', 'p')
      .where('s.id = :sprintId', { sprintId })
      .getOne();

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    return sprint;
  }

  private async canUserEditSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintById(sprintId);

    const project = await this.projectRepo
      .createQueryBuilder('p')
      .select(['p.id', 'l.id'])
      .leftJoin('p.leader', 'l')
      .where('p.id = :projectId', { projectId: sprint?.project?.id })
      .getOne();

    if (!project) {
      throw new NotFoundException('Sprint not belong to any project');
    }

    if (project?.leader?.id !== userId) {
      throw new UnauthorizedException('You cannot update this sprint');
    }

    return sprint;
  }
}
