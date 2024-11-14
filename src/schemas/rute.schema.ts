import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'route_statics',
})
export class Rute extends Document {
  @Prop({
    type: [[Number]],
  })
  RUAS: number[][];

  @Prop({
    type: [String],
  })
  KETERANGAN: string[];

  @Prop({
    type: String,
  })
  COMPANY: string;

  @Prop({
    type: String,
    unique: true,
  })
  GUID: string;

  @Prop({
    type: String,
  })
  NO_RUAS: string;

  @Prop({
    type: String,
  })
  NAMA_RUAS_JALAN: string;

  @Prop({
    type: String,
  })
  KECAMATAN_YANG_DILALUI: string;
}

export const RuteSchema = SchemaFactory.createForClass(Rute);
