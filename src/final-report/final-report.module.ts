import { Module } from '@nestjs/common';
import { FinalReportService } from './final-report.service';
import { FinalReportController } from './final-report.controller';
import { ReportSchema } from 'src/schemas/final-report.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FinalReport', schema: ReportSchema }]),
  ],
  controllers: [FinalReportController],
  providers: [FinalReportService],
})
export class FinalReportModule {}
