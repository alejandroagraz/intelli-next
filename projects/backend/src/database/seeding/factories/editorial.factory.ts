import { setSeederFactory } from 'typeorm-extension';
import { EditorialEntity } from '../../../editorials/entity/editorial.entity';

export default setSeederFactory(EditorialEntity, async (faker) => {
  const editorial = new EditorialEntity();

  editorial.name = faker.company.name();
  editorial.phone = faker.helpers.fromRegExp(/57318[0-9]{7}/);
  editorial.email = faker.internet.email(editorial.name);
  return editorial;
});
