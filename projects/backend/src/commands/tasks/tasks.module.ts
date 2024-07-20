import { Module } from '@nestjs/common';
import { TasksAuthorNumberBooksPublishedService } from './tasks.authorNumberBooksPublished.service';
import { AuthorsModule } from '../../authors/authors.module';

@Module({
  imports: [AuthorsModule],
  providers: [TasksAuthorNumberBooksPublishedService],
})
export class TasksModule {}
