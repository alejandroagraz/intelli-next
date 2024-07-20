import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entity/author.entity';
import { FormatExcelModule } from '../common/format-excel/format-excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity]), FormatExcelModule],
  providers: [AuthorsService],
  exports: [AuthorsService],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
