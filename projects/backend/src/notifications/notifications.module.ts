import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [AuthorsModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
