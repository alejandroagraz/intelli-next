import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AuthorEntity } from '../../../authors/entity/author.entity';
import { EditorialEntity } from '../../../editorials/entity/editorial.entity';
import { BookEntity } from '../../../books/entity/book.entity';

export default class BookSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const authors = await dataSource.getRepository(AuthorEntity).find();
    const editorials = await dataSource.getRepository(EditorialEntity).find();

    if (authors.length > 0 && editorials.length > 0) {
      for (let i = 0; i < authors.length; i++) {
        const randomAuthor = Math.random() * authors.length;
        const randomEditorial = Math.random() * editorials.length;

        const author = authors[parseInt(String(randomAuthor))];
        const editorial = editorials[parseInt(String(randomEditorial))];

        const factory = factoryManager.get(BookEntity);
        await factory.save({
          author,
          editorial,
        });
      }
    }
  }
}
