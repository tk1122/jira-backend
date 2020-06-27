import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity, SprintEntityType, SprintStatus } from './entity/sprint.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotifEventType } from '../notification/entity/notification-detail.entity';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(SprintEntity) private readonly sprintRepo: Repository<SprintEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
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

    const [otherSprintsOfProjects, project] = await Promise.all([
      this.sprintRepo.find({ projectId: sprint.projectId }),
      this.projectService.getProjectByIdOrFail(sprint.projectId),
    ]);

    if (otherSprintsOfProjects.map(s => s.status).includes(SprintStatus.InProgress)) {
      throw new BadRequestException('Each project has only one active sprint');
    }

    const [leader, members, pm] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
      this.userService.getUserByIdOrFail(project.pmId),
    ]);

    sprint.startTime = new Date();
    sprint.status = SprintStatus.InProgress;

    this.notificationService
      .createNotifications(leader, [pm, ...members], sprint.id, SprintEntityType, sprint.name, NotifEventType.StartSprint)
      .then();

    return this.sprintRepo.save(sprint);
  }

  async finishSprint(sprintId: number, userId: number) {
    const sprint = await this.sprintRepo.findOneOrFail({ id: sprintId });

    if (!(await this.canUserEditSprint(userId, sprint))) {
      throw new BadRequestException('You cannot finish this sprint');
    }

    if (sprint.status !== SprintStatus.InProgress) {
      throw new BadRequestException('This sprint is not currently active');
    }

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    const [leader, members, pm] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
      this.userService.getUserByIdOrFail(project.pmId),
    ]);

    sprint.finishTime = new Date();
    sprint.status = SprintStatus.Finished;

    this.notificationService
      .createNotifications(leader, [pm, ...members], sprint.id, SprintEntityType, sprint.name, NotifEventType.FinishSprint)
      .then();

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

  async deleteSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this sprint');
    }

    return this.sprintRepo.remove(sprint);
  }
}
