import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AuthorEntity } from '../../../authors/entity/author.entity';

export default class AuthorSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const factory = factoryManager.get(AuthorEntity);
    await factory.save();
    await factory.saveMany(10);
  }
}
