import { setSeederFactory } from 'typeorm-extension';
import { BookEntity } from '../../../books/entity/book.entity';

export default setSeederFactory(BookEntity, async (faker) => {
  const book = new BookEntity();

  book.title = faker.random.words({ min: 2, max: 3 });
  book.year = faker.date
    .birthdate({ max: 70, min: 1, mode: 'age' })
    .getFullYear();
  book.isbn = parseInt(faker.random.numeric(13));
  return book;
});
