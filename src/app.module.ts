import { Module } from '@nestjs/common';
import { RuteModule } from './rute/rute.module';
import { SurveyModule } from './survey/survey.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FinalReportModule } from './final-report/final-report.module';
import { FtvModule } from './ftv/ftv.modul';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    RuteModule,
    SurveyModule,
    AuthModule,
    FtvModule,
    FinalReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
