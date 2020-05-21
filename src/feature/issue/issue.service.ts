import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity, IssuePriority, IssueType } from './entity/issue.entity';
import { Repository } from 'typeorm';
import { LabelEntity } from './entity/label.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    @InjectRepository(LabelEntity)
    private readonly labelRepo: Repository<LabelEntity>,
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
  ) {}
}
