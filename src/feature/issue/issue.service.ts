import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssuePriority, IssueType } from './entity/issue.entity';
import { In, Repository } from 'typeorm';
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

  async createIssue(
    userId: number,
    name: string,
    description: string,
    assigneeId: number,
    reporterId: number,
    projectId: number,
    epicId?: number,
    sprintId?: number,
    labelIds?: number[],
    storyPoint?: number,
    priority?: IssuePriority,
    type?: IssueType,
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
      labelIds !== undefined ? this.labelRepo.find({ id: In(labelIds) }) : undefined,
    ]);

    if (!this.projectService.isMemberOfProject(assignee.id, project)) {
      throw new BadRequestException('Assignee is not a member of this project');
    }

    if (!this.projectService.isMemberOfProject(reporter.id, project)) {
      throw new BadRequestException('Reporter is not a member of this project');
    }

    if (epic && epic.projectId !== projectId) {
      throw new BadRequestException('Epic is not belong to project');
    }

    if (sprint && sprint.projectId !== projectId) {
      throw new BadRequestException('Sprint is not belong to project');
    }

    if (labels && labels.some(l => l.projectId !== project.id)) {
      throw new UnauthorizedException('Cannot add label to this issue');
    }

    const issue = await this.issueRepo.save(
      new IssueEntity(name, description, assignee, reporter, project, epic, sprint, labels, storyPoint, priority, type),
    );

    return this.issueRepo.findOne({ id: issue.id });
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
}
