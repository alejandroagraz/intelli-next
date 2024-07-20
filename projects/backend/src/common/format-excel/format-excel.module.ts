import { Module } from '@nestjs/common';
import { FormatExcelService } from './format-excel.service';

@Module({
  providers: [FormatExcelService],
  exports: [FormatExcelService],
})
export class FormatExcelModule {}
