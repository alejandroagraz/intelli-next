import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { EditorialEntity } from '../../../editorials/entity/editorial.entity';

export default class EditorialSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const factory = factoryManager.get(EditorialEntity);
    await factory.save();
    await factory.saveMany(10);
  }
}
