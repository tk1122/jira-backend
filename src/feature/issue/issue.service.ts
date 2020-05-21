import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssuePriority, IssueType } from './entity/issue.entity';
import { Repository } from 'typeorm';
import { LabelEntity } from './entity/label.entity';
import { EpicEntity } from '../epic/entity/epic.entity';
import { SprintEntity } from '../sprint/entity/sprint.entity';
import { ProjectEntity } from '../project/entity/project.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    @InjectRepository(LabelEntity)
    private readonly labelRepo: Repository<LabelEntity>,
    @InjectRepository(EpicEntity)
    private readonly epicRepo: Repository<EpicEntity>,
    @InjectRepository(SprintEntity)
    private readonly sprintRepo: Repository<SprintEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
  ) {}

  async createIssue(
    userId: number,
    name: string,
    description: string,
    assigneeId: number,
    reporterId: number,
    epicId: number,
    storyPoint: number | undefined,
    priority: IssuePriority | undefined,
    type: IssueType | undefined,
    labelIds: number[] | undefined,
  ) {
    const epics = await this.epicRepo.findByIds([epicId]);

    if (epics.length === 0) {
      throw new BadRequestException('Epic not found');
    }

    console.log(epics);

    const project = await this.projectRepo.findOne({ epics }, { relations: ['leader'] });

    if (!project) {
      throw new NotFoundException('Epic not belong to any project');
    }

    console.log(project);

    if (project?.leader?.id !== userId) {
      throw new UnauthorizedException('You cannot create this issue');
    }
  }
}
