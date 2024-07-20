export class NumberBooksPublishedEvent {
  constructor(
    public author_id: string,
    public countBooks: number,
  ) {}
}
