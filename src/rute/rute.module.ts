import { Module } from '@nestjs/common';
import { RuteService } from './rute.service';
import { RuteController } from './rute.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RuteSchema } from '../schemas/rute.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rute', schema: RuteSchema }])],
  controllers: [RuteController],
  providers: [RuteService],
})
export class RuteModule {}
