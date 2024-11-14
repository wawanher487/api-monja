import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'Kegiatan_survey',
})
export class Survey  extends Document{
  @Prop()
  guid_survey: string;

  @Prop()
  surveyor: string;

  @Prop()
  uploader: string;

  @Prop()
  rute: string;

  @Prop()
  guid_rute:  string;

  @Prop()
  tanggal_survey: string;

  @Prop()
  kamera: string;

  @Prop()
  namafiles: string;

  @Prop()
  status: string;

  @Prop()
  tanggal_upload: string;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
