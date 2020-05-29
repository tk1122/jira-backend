import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiUseTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {
  }
}
