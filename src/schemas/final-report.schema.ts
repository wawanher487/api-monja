import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class SurfaceHardness {
  @Prop({ type: String })
  ORDER: string;

  @Prop({ type: String })
  CONDITION: string;

  @Prop({ type: String })
  DECREASE: string;

  @Prop({ type: String })
  PATCHES: string;
}

@Schema()
class Cracks {
  @Prop({ type: String })
  TYPE: string;

  @Prop({ type: String })
  WIDE: string;

  @Prop({ type: String })
  LARGE: string;
}

@Schema()
class OtherDamage {
  @Prop({ type: String })
  HOLE_NUMBER: string;

  @Prop({ type: String })
  HOLE_SIZE: string;

  @Prop({ type: String })
  EX_WHEEL: string;

  @Prop({ type: String })
  LEFT_DAMAGE_EDGE: string;

  @Prop({ type: String })
  RIGHT_DAMAGE_EDGE: string;
}

@Schema()
class ShoulderChannelSide {
  @Prop({ type: String })
  LEFT_SHOULDER_CONDITION: string;

  @Prop({ type: String })
  RIGHT_SHOULDER_CONDITION: string;

  @Prop({ type: String })
  LEFT_SHOULDER_SURFACE: string;

  @Prop({ type: String })
  RIGHT_SHOULDER_SURFACE: string;

  @Prop({ type: String })
  LEFT_CHANNEL_SIDE_CONDITION: string;

  @Prop({ type: String })
  RIGHT_CHANNEL_SIDE_CONDITION: string;

  @Prop({ type: String })
  DAMAGE_SLOPE_LEFT: string;

  @Prop({ type: String })
  DAMAGE_SLOPE_RIGHT: string;

  @Prop({ type: String })
  SIDEWALK_LEFT: string;

  @Prop({ type: String })
  SIDEWALK_RIGHT: string;
}

@Schema()
class SDICalculation {
  @Prop({ type: Number })
  RETAK_LUAS: number;

  @Prop({ type: Number })
  RETAK_LEBAR: number;

  @Prop({ type: Number })
  JUMLAH_LUBANG: number;

  @Prop({ type: Number })
  BEKAS_RODA: number;
}

@Schema()
class PanjangKondisi {
  @Prop({ type: Number })
  BAIK: number;

  @Prop({ type: Number })
  SEDANG: number;

  @Prop({ type: Number })
  RUSAK_RINGAN: number;

  @Prop({ type: Number })
  RUSAK_BERAT: number;
}

@Schema()
class Kemantapan {
  @Prop({ type: Number })
  MANTAP: number;

  @Prop({ type: Number })
  TIDAK_MANTAP: number;
}

@Schema()
class FormSurvey extends Document{
  @Prop({ type: SurfaceHardness })
  SURFACE_HARDNESS: SurfaceHardness;

  @Prop({ type: Cracks })
  CRACKS: Cracks;

  @Prop({ type: OtherDamage })
  OTHER_DAMAGE: OtherDamage;

  @Prop({ type: ShoulderChannelSide })
  SHOULDER_CHANNEL_SIDE: ShoulderChannelSide;

  @Prop({ type: Boolean })
  CEK_STATUS_ENTRY: boolean;

  @Prop({ type: String })
  Status_jalan: string;

  @Prop({ type: SDICalculation })
  SDI_Calculation: SDICalculation;

  @Prop({ type: Number })
  NILAI_SDI: number;

  @Prop({ type: [Number] })
  Data_Angka: number[];

  @Prop({ type: PanjangKondisi })
  PANJANG_KONDISI: PanjangKondisi;

  @Prop({ type: Kemantapan })
  KEMANTAPAN: Kemantapan;

  @Prop({ type: String })
  JENIS_PENANGANAN: string;

  @Prop({ type: Number })
  IRI: number;
}

@Schema({ timestamps: true })
export class FinalReport extends Document {
   @Prop({ type: String }) // Tambahkan ini agar Mongoose tahu `_id` adalah string
  _id: string;

  @Prop({ type: String })
  namafile: string;

  @Prop({ type: [Number] })
  coordinate: number[];

  @Prop({ type: String })
  guid_survey: string;

  @Prop({ type: String })
  original_file_video: string;

  @Prop({ type: String })
  surveyor: string;

  @Prop({ type: String })
  uploader: string;

  @Prop({ type: String })
  kamera: string;

  @Prop({ type: String })
  rute: string;

  @Prop({ type: String})
  guid_rute: string;

  @Prop({ type: String })
  tanggal_survey: string;

  @Prop({ type: String })
  tanggal_upload: string;

  @Prop({ type: Number })
  kilometer: number;

  @Prop({ type: Number })
  station: number;

  @Prop({ type: String })
  status_ai: string;

  @Prop({ type: String })
  status_jalan: string;

  @Prop({ type: FormSurvey })
  FORM_SURVEY: FormSurvey;

  @Prop({ type: Boolean })
  downloadable: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(FinalReport);
