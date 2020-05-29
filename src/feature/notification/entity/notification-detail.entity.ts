import { ProjectEntityType } from '../../project/entity/project.entity';
import { EpicEntityType } from '../../epic/entity/epic.entity';
import { SprintEntityType } from '../../sprint/entity/sprint.entity';
import { IssueEntityType } from '../../issue/entity/issue.entity';

export enum NotifEventType {
  Created,
  Updated,
  Added,
  Removed,
  IssueStatusChanged,
  Assigned,
  Reported,
  Deleted,
}

export interface Notification {
  producerId: number;
  message: string;
  entityId: number;
  entityType: EntityType;
  createdAt: Date;
  status: NotifStatus
}

export type EntityType = typeof IssueEntityType | typeof ProjectEntityType | typeof EpicEntityType | typeof SprintEntityType;

export enum NotifStatus {
  Unread,
  Read,
}
