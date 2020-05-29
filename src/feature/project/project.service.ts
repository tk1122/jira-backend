import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity, ProjectEntityType, ProjectStatus } from './entity/project.entity';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity, Roles } from '../user/entity/role.entity';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { NotifEventType } from '../notification/entity/notification-detail.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
    private readonly notifService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async getProjectByIdOrFail(projectId: number) {
    try {
      return await this.projectRepo.findOneOrFail({ id: projectId });
    } catch (e) {
      throw new NotFoundException('Project not found');
    }
  }

  isLeaderOfProject(userId: number, project: ProjectEntity) {
    return project.leaderId === userId;
  }

  isPMOfProject(userId: number, project: ProjectEntity) {
    return project.pmId === userId;
  }

  isMemberOfProject(userId: number, project: ProjectEntity) {
    return !(project.pmId !== userId && project.leaderId !== userId && !project.memberIds.includes(userId));
  }

  async createProject(name: string, description: string, pmId: number, leaderId: number) {
    const [leader, pm] = await Promise.all([
      this.userRepo
        .createQueryBuilder('u')
        .select(['u.id'])
        .innerJoin('u.roles', 'r')
        .where('u.id = :leaderId', { leaderId })
        .where('r.name = :leaderRole', { leaderRole: Roles.Leader })
        .getOne(),
      this.userService.getUserByIdOrFail(pmId),
    ]);

    if (!leader) {
      throw new BadRequestException('Leader not found');
    }

    const project = await this.projectRepo.save(new ProjectEntity(name, description, { id: pmId } as UserEntity, leader));

    this.notifService.createNotifications(pm!, [leader], project.id, ProjectEntityType, NotifEventType.Added).then();

    return project;
  }

  async updateProject(
    projectId: number,
    pmId: number,
    leaderId?: number,
    memberIds?: number[],
    name?: string,
    description?: string,
    status?: ProjectStatus,
  ) {
    const [project, pm] = await Promise.all([this.getProjectByIdOrFail(projectId), this.userService.getUserByIdOrFail(pmId)]);

    if (!this.isPMOfProject(pmId, project)) {
      throw new UnauthorizedException('You cannot update this project');
    }

    const [members, leader, oldMembers, oldLeader] = await Promise.all([
      memberIds !== undefined ? this.userRepo.findByIds(memberIds) : undefined,
      leaderId !== undefined ? this.userService.getUserByIdOrFail(leaderId) : undefined,
      this.userRepo.findByIds(project.memberIds),
      this.userService.getUserByIdOrFail(project.leaderId),
    ]);

    if (leader) {
      if (leader.id !== oldLeader.id) {
        this.notifService.createNotifications(pm, [oldLeader], project.id, ProjectEntityType, NotifEventType.Removed).then();
        this.notifService.createNotifications(pm, [leader], project.id, ProjectEntityType, NotifEventType.Added).then();
      }

      project.leader = leader;
    }

    if (members) {
      const oldMemberIds = oldMembers.map(m => m.id);
      const memberIds = members.map(m => m.id);

      const newMembers = members.filter(m => !oldMemberIds.includes(m.id));
      this.notifService.createNotifications(pm, newMembers, project.id, ProjectEntityType, NotifEventType.Added).then();

      const removedMembers = oldMembers.filter(m => !memberIds.includes(m.id));
      this.notifService.createNotifications(pm, removedMembers, project.id, ProjectEntityType, NotifEventType.Removed).then();

      project.members = members;
    }

    let isProjectUpdated = false;
    if (name !== undefined) {
      isProjectUpdated = true;
      project.name = name;
    }
    if (description !== undefined) {
      isProjectUpdated = true;
      project.description = description;
    }
    if (status !== undefined) {
      isProjectUpdated = true;
      project.status = status;
    }

    if (isProjectUpdated) {
      const membersAndLeader: UserEntity[] = [];
      members ? membersAndLeader.push(...members) : membersAndLeader.push(...oldMembers);
      leader ? membersAndLeader.push(leader) : membersAndLeader.push(oldLeader);

      this.notifService.createNotifications(pm, membersAndLeader, project.id, ProjectEntityType, NotifEventType.Updated).then();
    }

    return this.projectRepo.save(project);
  }

  async getProjects(userId: number, name = '', status?: ProjectStatus, page = 1, limit = 10) {
    const getProjectsQuery = this.projectRepo
      .createQueryBuilder('p')
      .select(['p'])
      .where('p.name LIKE :name', { name: `${name}%` })
      .innerJoin('p.members', 'm')
      .innerJoin('p.leader', 'l')
      .innerJoin('p.pm', 'pm');

    if (status !== undefined) {
      getProjectsQuery.andWhere('p.status = :status', { status });
    }

    getProjectsQuery.andWhere(
      new Brackets(qb => {
        return qb
          .andWhere('l.id = :userId', { userId })
          .orWhere('pm.id = :userId', { userId })
          .orWhere('m.id = :userId', { userId });
      }),
    );

    getProjectsQuery.skip((page - 1) * limit).take(limit);

    return getProjectsQuery.getMany();
  }

  async getOneProject(projectId: number, userId: number) {
    const project = await this.getProjectByIdOrFail(projectId);

    if (!this.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get this project');
    }

    return project;
  }

  async deleteProject(projectId: number, userId: number) {
    const [project, pm] = await Promise.all([this.getProjectByIdOrFail(projectId), this.userService.getUserByIdOrFail(userId)]);

    if (!this.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this project');
    }

    const [leader, members] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userRepo.findByIds(project.memberIds),
    ]);

    this.notifService.createNotifications(pm, [leader, ...members], project.id, ProjectEntityType, NotifEventType.Deleted).then();

    return this.projectRepo.remove(project);
  }
}
