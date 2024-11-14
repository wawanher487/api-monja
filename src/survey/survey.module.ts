import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveySchema } from 'src/schemas/survey.schema';
import { RuteSchema } from 'src/schemas/rute.schema';
import { RuteService } from 'src/rute/rute.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Survey', schema: SurveySchema }, { name: 'Rute', schema: RuteSchema }]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService, RuteService],
})
export class SurveyModule {}
