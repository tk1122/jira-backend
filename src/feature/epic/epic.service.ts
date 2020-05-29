import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpicEntity, EpicEntityType } from './entity/epic.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotifEventType } from '../notification/entity/notification-detail.entity';

@Injectable()
export class EpicService {
  constructor(
    @InjectRepository(EpicEntity) private readonly epicRepo: Repository<EpicEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly notifService: NotificationService,
  ) {}

  async getEpicByIdOrFail(epicId: number) {
    try {
      return await this.epicRepo.findOneOrFail({ id: epicId });
    } catch (e) {
      throw new NotFoundException('Epic not found');
    }
  }

  async createEpic(projectId: number, userId: number, name: string, description: string, startDate: Date, endDate: Date) {
    const [project, pm] = await Promise.all([
      this.projectService.getProjectByIdOrFail(projectId),
      this.userService.getUserByIdOrFail(userId),
    ]);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannnot create epic for this project');
    }

    const [leader, members] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
    ]);

    const epic = await this.epicRepo.save(new EpicEntity(name, description, startDate, endDate, projectId));

    this.notifService.createNotifications(pm, [leader, ...members], epic.id, EpicEntityType, NotifEventType.Created);

    return epic;
  }

  async updateEpic(epicId: number, userId: number, name?: string, description?: string, startDate?: Date, endDate?: Date) {
    const [epic, pm] = await Promise.all([this.getEpicByIdOrFail(epicId), this.userService.getUserByIdOrFail(userId)]);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update this epic');
    }

    const [leader, members] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
    ]);

    let isEpicUpdated = false;

    if (name !== undefined) {
      isEpicUpdated = true;
      epic.name = name;
    }

    if (description !== undefined) {
      isEpicUpdated = true;
      epic.description = description;
    }

    if (startDate !== undefined) {
      isEpicUpdated = true;
      epic.startDate = startDate;
    }

    if (endDate !== undefined) {
      isEpicUpdated = true;
      epic.endDate = endDate;
    }

    if (isEpicUpdated) {
      this.notifService.createNotifications(pm, [leader, ...members], epic.id, EpicEntityType, NotifEventType.Updated).then();
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

  async deleteEpic(epicId: number, userId: number) {
    const [epic, pm] = await Promise.all([this.getEpicByIdOrFail(epicId), this.userService.getUserByIdOrFail(userId)]);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this epic');
    }

    const [leader, members] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
    ]);

    this.notifService.createNotifications(pm, [leader, ...members], epic.id, EpicEntityType, NotifEventType.Deleted).then();

    return this.epicRepo.remove(epic);
  }
}
