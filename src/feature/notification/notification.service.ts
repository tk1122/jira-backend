import { Injectable } from '@nestjs/common';
import { EntityType, NotifEventType, Notification, NotifStatus } from './entity/notification-detail.entity';
import { IssueStatus } from '../issue/entity/issue.entity';
import * as FBAdmin from 'firebase-admin';
import * as serviceAccount from '../../../jira-22139-firebase-adminsdk-24523-de225903f3.json';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class NotificationService {
  private readonly admin: FBAdmin.app.App;
  private readonly store: FirebaseFirestore.Firestore;

  constructor() {
    this.admin = FBAdmin.initializeApp({
      // @ts-ignore
      credential: FBAdmin.credential.cert(serviceAccount),
      databaseURL: 'https://jira-22139.firebaseio.com',
    });
    this.store = this.admin.firestore();
  }

  async createNotifications(
    producer: UserEntity,
    consumers: UserEntity[],
    entityId: number,
    entityType: EntityType,
    eventType: NotifEventType,
    issueStatusFrom?: IssueStatus,
    issueStatusTo?: IssueStatus,
  ) {
    consumers.forEach(async c => {
      const userRef = this.store.collection(c.id.toString());

      const noti: Notification = {
        producerId: producer.id,
        message: this.createNotificationMessage(producer, eventType, entityType, issueStatusFrom, issueStatusTo),
        entityId,
        entityType,
        createdAt: new Date(),
        status: NotifStatus.Unread,
      };

      await userRef.add(noti);
    });
  }

  private createNotificationMessage(
    producer: UserEntity,
    eventType: NotifEventType,
    entityType?: EntityType,
    issueStatusFrom?: IssueStatus,
    issueStatusTo?: IssueStatus,
  ) {
    switch (eventType) {
      case NotifEventType.Assigned:
      case NotifEventType.Reported:
      case NotifEventType.Added:
      case NotifEventType.Removed:
        return `${this.createProducerPart(producer)}${this.createActionPart(eventType)}`;
      case NotifEventType.IssueStatusChanged:
        return `${this.createProducerPart(producer)}${this.createActionPart(eventType)}${this.createIssueStatusPart(
          issueStatusFrom || 0,
          issueStatusTo || 0,
        )}`;
      default:
        return `${this.createProducerPart(producer)}${this.createActionPart(eventType)}${this.createEntityPart(entityType || 0)}`;
    }
  }

  private createProducerPart(producer: UserEntity) {
    return `${producer.fullname} `;
  }

  private createActionPart(eventType: NotifEventType) {
    switch (eventType) {
      case NotifEventType.Created:
        return 'created ';
      case NotifEventType.Deleted:
        return 'deleted ';
      case NotifEventType.Updated:
        return 'updated ';
      case NotifEventType.IssueStatusChanged:
        return 'changed an issue';
      case NotifEventType.Assigned:
        return 'assigned an issue to you ';
      case NotifEventType.Reported:
        return 'made you the reporter of an issue ';
      case NotifEventType.Added:
        return 'added you to a project ';
      case NotifEventType.Removed:
        return 'removed you from a project '
    }
  }

  private createIssueStatusPart(from: IssueStatus, to: IssueStatus) {
    return `from ${IssueStatus[from]} to ${IssueStatus[to]}`;
  }

  private createEntityPart(entityType: EntityType) {
    switch (entityType) {
      case 0:
        return 'a project ';
      case 1:
        return 'an epic ';
      case 2:
        return 'a sprint ';
      case 3:
        return 'an issue ';
    }
  }
}
