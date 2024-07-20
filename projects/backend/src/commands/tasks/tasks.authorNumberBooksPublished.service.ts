import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AuthorsService } from '../../authors/authors.service';

@Injectable()
export class TasksAuthorNumberBooksPublishedService {
  constructor(
    private readonly _authorsService: AuthorsService,
    private readonly _schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'update-all-author-number-books-published',
  })
  async handleCron() {
    this._schedulerRegistry.deleteCronJob(
      'update-all-author-number-books-published',
    );
    await this._authorsService.updateAllAuthorNumberBooksPublished();
  }
}
