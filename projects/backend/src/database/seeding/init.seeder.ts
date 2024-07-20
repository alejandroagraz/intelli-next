import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import userFactory from './factories/user.factory';
import authorFactory from './factories/author.factory';
import editorialFactory from './factories/editorial.factory';
import bookFactory from './factories/book.factory';
import UserSeeder from './seeds/user.seeder';
import AuthorSeeder from './seeds/author.seeder';
import EditorialSeeder from './seeds/editorial.seeder';
import BookSeeder from './seeds/book.seeder';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, AuthorSeeder, EditorialSeeder, BookSeeder],
      factories: [userFactory, authorFactory, editorialFactory, bookFactory],
    });
  }
}
