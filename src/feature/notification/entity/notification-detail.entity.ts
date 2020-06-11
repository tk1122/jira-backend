import { ProjectEntityType } from '../../project/entity/project.entity';
import { EpicEntityType } from '../../epic/entity/epic.entity';
import { SprintEntityType } from '../../sprint/entity/sprint.entity';
import { IssueEntityType } from '../../issue/entity/issue.entity';

export enum NotifEventType {
  Created,
  Updated,
  AddedToProject,
  RemovedFromProject,
  IssueStatusChanged,
  StartSprint,
  FinishSprint,
  Assigned,
  AssigneeRemoved,
  ReporterRemoved,
  Reported,
  Deleted,
}

export interface Notification {
  producerId: number;
  message: string;
  entityId: number;
  entityType: EntityType;
  enittyName: string;
  createdAt: Date;
  status: NotifStatus;
}

export type EntityType = typeof IssueEntityType | typeof ProjectEntityType | typeof EpicEntityType | typeof SprintEntityType;

export enum NotifStatus {
  Pending,
  Unread,
  Read
}
