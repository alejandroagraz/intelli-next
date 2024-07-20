import { setSeederFactory } from 'typeorm-extension';
import { AuthorEntity } from '../../../authors/entity/author.entity';
export default setSeederFactory(AuthorEntity, async (faker) => {
  const author = new AuthorEntity();

  author.name = faker.name.firstName();
  author.lastname = faker.name.lastName();
  return author;
});
