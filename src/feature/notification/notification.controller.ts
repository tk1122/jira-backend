import { Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';

@Controller('notifications')
@ApiUseTags('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Put('/mark-as-received')
  @Scopes(PermissionScopes.WriteNotification)
  markAsReceivedMany(@User() { userId }: UserSession) {
    return this.notificationService.markAsReceivedMany(userId);
  }

  @Put('/mark-as-read/:id')
  @Scopes(PermissionScopes.WriteNotification)
  markAsReadOne(@User() { userId }: UserSession, @Param('id') notifId: string) {
    return this.notificationService.markAsReadOne(userId, notifId);
  }

  @Put('/mark-as-read')
  @Scopes(PermissionScopes.WriteNotification)
  markAsReadMany(@User() { userId }: UserSession) {
    return this.notificationService.markAsReadMany(userId);
  }

  @Delete(':id')
  @Scopes(PermissionScopes.WriteNotification)
  deleteOneNotif(@User() { userId }: UserSession, @Param('id') notifId: string) {
    return this.notificationService.deleteOneNotif(userId, notifId);
  }
}
