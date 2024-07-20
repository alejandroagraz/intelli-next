import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NumberBooksPublishedEvent } from '../events/number-books-published.event';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly _authorsService: AuthorsService) {}

  @OnEvent('number.books.published')
  async notifyUser(payload: NumberBooksPublishedEvent) {
    await this._authorsService.updateNumberBooksPublished(
      payload.author_id,
      payload.countBooks,
    );
  }
}
