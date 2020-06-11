import { Controller, Put } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { User } from '../../shared/decorator/user.decorator';
import { UserSession } from '../../shared/interface/session.interface';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';

@Controller('notifications')
@ApiUseTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {
  }

  @Put('/markAsReceived')
  @Scopes(PermissionScopes.WriteNotification)
  markAsReceived(@User() {userId}: UserSession) {
    return this.notificationService.markAsReceived(userId)
  }
}
