import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssueEntityType, IssuePriority, IssueStatus, IssueType } from './entity/issue.entity';
import { Repository } from 'typeorm';
import { LabelEntity } from './entity/label.entity';
import { ProjectService } from '../project/project.service';
import { SprintService } from '../sprint/sprint.service';
import { EpicService } from '../epic/epic.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { NotifEventType } from '../notification/entity/notification-detail.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    @InjectRepository(LabelEntity)
    private readonly labelRepo: Repository<LabelEntity>,
    private readonly projectService: ProjectService,
    private readonly sprintService: SprintService,
    private readonly epicService: EpicService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async getIssueByIdOrFail(issueId: number) {
    try {
      return await this.issueRepo.findOneOrFail({ id: issueId });
    } catch (e) {
      throw new NotFoundException('Issue not found');
    }
  }

  async createLabel(name: string, projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create label for this project');
    }

    const label = await this.labelRepo.findOne({ name, project });

    if (label) {
      throw new BadRequestException('Label already exists on this project');
    }

    return this.labelRepo.save(new LabelEntity(name, project.id));
  }

  async getManyLabel(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get label of this project');
    }

    return this.labelRepo.find({ project });
  }

  async getManyIssues(userId: number, projectId?: number) {
    if (projectId !== undefined) {
      const project = await this.projectService.getProjectByIdOrFail(projectId);

      if (!this.projectService.isMemberOfProject(userId, project)) {
        throw new UnauthorizedException('You cannot get issues of this project');
      }

      return this.issueRepo.find({ project });
    }

    return this.issueRepo.find({ assigneeId: userId });
  }

  async getOneIssue(issueId: number, userId: number) {
    const issue = await this.getIssueByIdOrFail(issueId);

    const project = await this.projectService.getProjectByIdOrFail(issue.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get issues of this project');
    }

    return issue;
  }

  async createIssue(
    userId: number,
    name: string,
    description: string,
    assigneeId: number,
    reporterId: number,
    projectId: number,
    epicId: number | undefined,
    sprintId: number | undefined,
    labelIds: number[] | undefined,
    storyPoint: number | undefined,
    priority: IssuePriority | undefined,
    type: IssueType | undefined,
  ) {
    const [project, leader] = await Promise.all([
      this.projectService.getProjectByIdOrFail(projectId),
      this.userService.getUserByIdOrFail(userId),
    ]);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create this issue');
    }

    const [assignee, reporter, epic, sprint, labels] = await Promise.all([
      this.userService.getUserByIdOrFail(assigneeId),
      this.userService.getUserByIdOrFail(reporterId),
      epicId !== undefined ? this.epicService.getEpicByIdOrFail(epicId) : undefined,
      sprintId !== undefined ? this.sprintService.getSprintByIdOrFail(sprintId) : undefined,
      labelIds !== undefined ? this.labelRepo.findByIds(labelIds) : undefined,
    ]);

    if (
      this.projectService.isLeaderOfProject(assignee.id, project) ||
      this.projectService.isPMOfProject(assignee.id, project) ||
      !this.projectService.isMemberOfProject(assignee.id, project)
    ) {
      throw new BadRequestException('Cannot assign issue to this user');
    }

    if (
      this.projectService.isLeaderOfProject(reporter.id, project) ||
      this.projectService.isPMOfProject(reporter.id, project) ||
      !this.projectService.isMemberOfProject(reporter.id, project)
    ) {
      throw new BadRequestException('Cannot make this user reporter of this issue');
    }

    if (epic && epic.projectId !== project.id) {
      throw new BadRequestException('Epic is not belong to project');
    }

    if (sprint && sprint.projectId !== project.id) {
      throw new BadRequestException('Sprint is not belong to project');
    }

    if (labels && labels.some(l => l.projectId !== project.id)) {
      throw new UnauthorizedException('Cannot add label to this issue');
    }

    const issue = await this.issueRepo.save(
      new IssueEntity(name, description, assignee.id, reporter.id, project.id, labels, epic?.id, sprint?.id, storyPoint, priority, type),
    );

    this.notificationService.createNotifications(leader, [assignee], issue.id, IssueEntityType, issue.name, NotifEventType.Assigned).then();
    this.notificationService.createNotifications(leader, [reporter], issue.id, IssueEntityType, issue.name, NotifEventType.Reported).then();

    return issue;
  }

  async updateIssue(
    issueId: number,
    userId: number,
    name: string | undefined,
    description: string | undefined,
    assigneeId: number | undefined,
    reporterId: number | undefined,
    epicId: number | null | undefined,
    sprintId: number | null | undefined,
    type: IssueType | undefined,
    storyPoint: number | undefined,
    priority: IssuePriority | undefined,
    labelIds: number[] | undefined,
  ) {
    const [issue, leader] = await Promise.all([this.getIssueByIdOrFail(issueId), this.userService.getUserByIdOrFail(userId)]);

    const project = await this.projectService.getProjectByIdOrFail(issue.projectId);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update this issue');
    }

    let isIssueUpdated = false;

    if (name !== undefined) {
      isIssueUpdated = true;
      issue.name = name;
    }

    if (description !== undefined) {
      isIssueUpdated = true;
      issue.description = description;
    }

    if (type !== undefined) {
      isIssueUpdated = true;
      issue.type = type;
    }

    if (storyPoint !== undefined) {
      isIssueUpdated = true;
      issue.storyPoint = storyPoint;
    }

    if (priority !== undefined) {
      isIssueUpdated = true;
      issue.priority = priority;
    }

    const [assignee, reporter, epic, sprint, labels, oldAssignee, oldReporter] = await Promise.all([
      assigneeId !== undefined ? this.userService.getUserByIdOrFail(assigneeId) : undefined,
      reporterId !== undefined ? this.userService.getUserByIdOrFail(reporterId) : undefined,
      epicId === null ? null : epicId !== undefined ? this.epicService.getEpicByIdOrFail(epicId) : undefined,
      sprintId === null ? null : sprintId !== undefined ? this.sprintService.getSprintByIdOrFail(sprintId) : undefined,
      labelIds !== undefined ? this.labelRepo.findByIds(labelIds) : undefined,
      this.userService.getUserByIdOrFail(issue.assigneeId),
      this.userService.getUserByIdOrFail(issue.reporterId),
    ]);

    if (assignee !== undefined) {
      if (
        this.projectService.isLeaderOfProject(assignee.id, project) ||
        this.projectService.isPMOfProject(assignee.id, project) ||
        !this.projectService.isMemberOfProject(assignee.id, project)
      ) {
        throw new BadRequestException('Assignee is not a member of this project');
      }
      if (assignee.id !== oldAssignee.id) {
        this.notificationService.createNotifications(leader, [assignee], issue.id, IssueEntityType, issue.name, NotifEventType.Assigned).then();
        this.notificationService
          .createNotifications(leader, [oldAssignee], issue.id, IssueEntityType, issue.name, NotifEventType.AssigneeRemoved)
          .then();
      }
      issue.assigneeId = assignee.id;
    }

    if (reporter !== undefined) {
      if (
        this.projectService.isLeaderOfProject(reporter.id, project) ||
        this.projectService.isPMOfProject(reporter.id, project) ||
        !this.projectService.isMemberOfProject(reporter.id, project)
      ) {
        throw new BadRequestException('Reporter is not a member of this project');
      }
      if (reporter.id !== oldReporter.id) {
        this.notificationService.createNotifications(leader, [reporter], issue.id, IssueEntityType, issue.name, NotifEventType.Reported).then();
        this.notificationService
          .createNotifications(leader, [oldReporter], issue.id, IssueEntityType, issue.name, NotifEventType.ReporterRemoved)
          .then();
      }
      issue.reporterId = reporter.id;
    }

    if (epic !== undefined) {
      if (epic !== null && epic.projectId !== project.id) {
        throw new BadRequestException('Epic not belong to project');
      }

      issue.epicId = epic?.id ?? null;
      isIssueUpdated = true;
    }

    if (sprint !== undefined) {
      if (sprint !== null && sprint.projectId !== project.id) {
        throw new BadRequestException('Sprint not belong to project');
      }

      issue.sprintId = sprint?.id ?? null;
      isIssueUpdated = true;
    }

    if (labels !== undefined) {
      if (labels.map(l => l.projectId).some(id => id !== project.id)) {
        throw new BadRequestException('Labels not belong to project');
      }

      issue.labels = labels;
      isIssueUpdated = true;
    }

    if (isIssueUpdated) {
      const assigneeAndReporter = [];
      assigneeAndReporter.push(assignee ?? oldAssignee);
      assigneeAndReporter.push(reporter ?? oldReporter);
      this.notificationService.createNotifications(leader, assigneeAndReporter, issue.id, IssueEntityType, issue.name, NotifEventType.Updated).then();
    }

    return this.issueRepo.save(issue);
  }

  async updateIssueStatus(issueId: number, userId: number, status: IssueStatus) {
    const [issue, assignee] = await Promise.all([this.getIssueByIdOrFail(issueId), this.userService.getUserByIdOrFail(userId)]);

    if (userId !== issue.assigneeId) {
      throw new UnauthorizedException('You cannot update status of this issue');
    }

    const project = await this.projectService.getProjectByIdOrFail(issue.projectId);

    const [leader, reporter] = await Promise.all([
      this.userService.getUserByIdOrFail(project.leaderId),
      this.userService.getUserByIdOrFail(issue.reporterId),
    ]);

    if (issue.status !== status) {
      this.notificationService.createNotifications(
        assignee,
        [leader, reporter],
        issue.id,
        IssueEntityType,
        issue.name,
        NotifEventType.IssueStatusChanged,
        issue.status,
        status,
      );
    }
    issue.status = status;

    return this.issueRepo.save(issue);
  }

  async deleteIssue(issueId: number, userId: number) {
    const [issue, leader] = await Promise.all([this.getIssueByIdOrFail(issueId), this.userService.getUserByIdOrFail(userId)]);

    const [project, assignee, reporter] = await Promise.all([
      this.projectService.getProjectByIdOrFail(issue.projectId),
      this.userService.getUserByIdOrFail(issue.assigneeId),
      this.userService.getUserByIdOrFail(issue.reporterId),
    ]);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannnot delete this issue');
    }

    this.notificationService.createNotifications(leader, [assignee, reporter], issue.id, IssueEntityType, issue.name, NotifEventType.Deleted).then();

    return this.issueRepo.remove(issue);
  }
}
