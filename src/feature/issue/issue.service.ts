import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssuePriority, IssueType } from './entity/issue.entity';
import { Repository } from 'typeorm';
import { LabelEntity } from './entity/label.entity';
import { ProjectService } from '../project/project.service';
import { SprintService } from '../sprint/sprint.service';
import { EpicService } from '../epic/epic.service';
import { UserService } from '../user/user.service';

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

  async getManyIssues(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get issues of this project');
    }

    return this.issueRepo.find({ project });
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
    const project = await this.projectService.getProjectByIdOrFail(projectId);

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
      new IssueEntity(name, description, assignee, reporter, project, labels, epic, sprint, storyPoint, priority, type),
    );

    return this.issueRepo.findOne({ id: issue.id });
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
    const issue = await this.getIssueByIdOrFail(issueId);

    const project = await this.projectService.getProjectByIdOrFail(issue.projectId);

    console.log(issue);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update this issue');
    }

    if (name !== undefined) {
      issue.name = name;
    }

    if (description !== undefined) {
      issue.description = description;
    }

    if (type !== undefined) {
      issue.type = type;
    }

    if (storyPoint !== undefined) {
      issue.storyPoint = storyPoint;
    }

    if (priority !== undefined) {
      issue.priority = priority;
    }

    const [assignee, reporter, epic, sprint, labels] = await Promise.all([
      assigneeId !== undefined ? this.userService.getUserByIdOrFail(assigneeId) : undefined,
      reporterId !== undefined ? this.userService.getUserByIdOrFail(reporterId) : undefined,
      epicId === null ? null : epicId !== undefined ? this.epicService.getEpicByIdOrFail(epicId) : undefined,
      sprintId === null ? null : sprintId !== undefined ? this.sprintService.getSprintByIdOrFail(sprintId) : undefined,
      labelIds !== undefined ? this.labelRepo.findByIds(labelIds) : undefined,
    ]);

    if (assignee !== undefined) {
      if (
        this.projectService.isLeaderOfProject(assignee.id, project) ||
        this.projectService.isPMOfProject(assignee.id, project) ||
        !this.projectService.isMemberOfProject(assignee.id, project)
      ) {
        throw new BadRequestException('Assignee is not a member of this project');
      }
      issue.assignee = assignee;
    }

    if (reporter !== undefined) {
      if (
        this.projectService.isLeaderOfProject(reporter.id, project) ||
        this.projectService.isPMOfProject(reporter.id, project) ||
        !this.projectService.isMemberOfProject(reporter.id, project)
      ) {
        throw new BadRequestException('Reporter is not a member of this project');
      }
      issue.reporter = reporter;
    }

    if (epic !== undefined) {
      if (epic !== null && epic.projectId !== project.id) {
        throw new BadRequestException('Epic not belong to project');
      }

      issue.epic = epic;
    }

    if (sprint !== undefined) {
      if (sprint !== null && sprint.projectId !== project.id) {
        throw new BadRequestException('Sprint not belong to project');
      }

      issue.sprint = sprint;
    }

    if (labels !== undefined) {
      if (labels.map(l => l.projectId).some(id => id !== project.id)) {
        throw new BadRequestException('Labels not belong to project');
      }

      issue.labels = labels;
    }

    await this.issueRepo.save(issue);

    return this.issueRepo.findOneOrFail(issue.id);
  }
}
