import { Module } from '@nestjs/common';
import { EditorialsController } from './editorials.controller';
import { EditorialsService } from './editorials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditorialEntity } from './entity/editorial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EditorialEntity])],
  providers: [EditorialsService],
  exports: [EditorialsService],
  controllers: [EditorialsController],
})
export class EditorialsModule {}
