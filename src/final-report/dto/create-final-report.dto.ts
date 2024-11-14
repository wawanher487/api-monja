import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';


class SurfaceHardnessDto {
  @IsString()
  @IsOptional()
  ORDER?: string;

  @IsString()
  @IsOptional()
  CONDITION?: string;

  @IsString()
  @IsOptional()
  DECREASE?: string;

  @IsString()
  @IsOptional()
  PATCHES?: string;
}

class CracksDto {
  @IsString()
  @IsOptional()
  TYPE?: string;

  @IsString()
  @IsOptional()
  WIDE?: string;

  @IsString()
  @IsOptional()
  LARGE?: string;
}

class OtherDamageDto {
  @IsString()
  @IsOptional()
  HOLE_NUMBER?: string;

  @IsString()
  @IsOptional()
  HOLE_SIZE?: string;

  @IsString()
  @IsOptional()
  EX_WHEEL?: string;

  @IsString()
  @IsOptional()
  LEFT_DAMAGE_EDGE?: string;

  @IsString()
  @IsOptional()
  RIGHT_DAMAGE_EDGE?: string;
}

class ShoulderChannelSideDto {
  @IsString()
  @IsOptional()
  LEFT_SHOULDER_CONDITION?: string;

  @IsString()
  @IsOptional()
  RIGHT_SHOULDER_CONDITION?: string;

  @IsString()
  @IsOptional()
  LEFT_SHOULDER_SURFACE?: string;

  @IsString()
  @IsOptional()
  RIGHT_SHOULDER_SURFACE?: string;

  @IsString()
  @IsOptional()
  LEFT_CHANNEL_SIDE_CONDITION?: string;

  @IsString()
  @IsOptional()
  RIGHT_CHANNEL_SIDE_CONDITION?: string;

  @IsString()
  @IsOptional()
  DAMAGE_SLOPE_LEFT?: string;

  @IsString()
  @IsOptional()
  DAMAGE_SLOPE_RIGHT?: string;

  @IsString()
  @IsOptional()
  SIDEWALK_LEFT?: string;

  @IsString()
  @IsOptional()
  SIDEWALK_RIGHT?: string;
}

class SDICalculationDto {
  @IsNumber()
  @IsOptional()
  RETAK_LUAS?: number;

  @IsNumber()
  @IsOptional()
  RETAK_LEBAR?: number;

  @IsNumber()
  @IsOptional()
  JUMLAH_LUBANG?: number;

  @IsNumber()
  @IsOptional()
  BEKAS_RODA?: number;
}

class PanjangKondisiDto {
  @IsNumber()
  @IsOptional()
  BAIK?: number;

  @IsNumber()
  @IsOptional()
  SEDANG?: number;

  @IsNumber()
  @IsOptional()
  RUSAK_RINGAN?: number;

  @IsNumber()
  @IsOptional()
  RUSAK_BERAT?: number;
}

class KemantapanDto {
  @IsNumber()
  @IsOptional()
  MANTAP?: number;

  @IsNumber()
  @IsOptional()
  TIDAK_MANTAP?: number;
}

export class FormSurveyDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => SurfaceHardnessDto)
  SURFACE_HARDNESS?: SurfaceHardnessDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => CracksDto)
  CRACKS?: CracksDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => OtherDamageDto)
  OTHER_DAMAGE?: OtherDamageDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => ShoulderChannelSideDto)
  SHOULDER_CHANNEL_SIDE?: ShoulderChannelSideDto;

  @IsBoolean()
  @IsOptional()
  CEK_STATUS_ENTRY?: boolean;

  @IsString()
  @IsOptional()
  Status_jalan?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => SDICalculationDto)
  SDI_Calculation?: SDICalculationDto;

  @IsNumber()
  @IsOptional()
  NILAI_SDI?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  Data_Angka?: number[];

  @ValidateNested()
  @IsOptional()
  @Type(() => PanjangKondisiDto)
  PANJANG_KONDISI?: PanjangKondisiDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => KemantapanDto)
  KEMANTAPAN?: KemantapanDto;

  @IsString()
  @IsOptional()
  JENIS_PENANGANAN?: string;

  @IsNumber()
  @IsOptional()
  IRI?: number;
}

export class CreateFinalReportDto {
  @IsString()
  @IsNotEmpty()
  namafile: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinate: number[];

  @IsString()
  @IsNotEmpty()
  guid_survey: string;

  @IsString()
  @IsNotEmpty()
  original_file_video: string;

  @IsString()
  @IsNotEmpty()
  surveyor: string;

  @IsString()
  @IsNotEmpty()
  uploader: string;

  @IsString()
  @IsNotEmpty()
  kamera: string;

  @IsString()
  @IsNotEmpty()
  rute: string;

  @IsString()
  @IsNotEmpty()
  guid_rute: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_survey: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_upload: string;

  @IsNumber()
  @IsNotEmpty()
  kilometer: number;

  @IsNumber()
  @IsNotEmpty()
  station: number;

  @IsString()
  @IsNotEmpty()
  status_ai: string;

  @IsString()
  @IsNotEmpty()
  status_jalan: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => FormSurveyDto)
  FORM_SURVEY?: FormSurveyDto;

  @IsBoolean()
  @IsNotEmpty()
  downloadable: boolean;
}


export class ResponseFinalReport {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  namafile: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinate: number[];

  @IsString()
  @IsNotEmpty()
  guid_survey: string;

  @IsString()
  @IsNotEmpty()
  original_file_video: string;

  @IsString()
  @IsNotEmpty()
  surveyor: string;

  @IsString()
  @IsNotEmpty()
  uploader: string;

  @IsString()
  @IsNotEmpty()
  kamera: string;

  @IsString()
  @IsNotEmpty()
  rute: string;

  @IsString()
  @IsNotEmpty()
  guid_rute: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_survey: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_upload: string;

  @IsNumber()
  @IsNotEmpty()
  kilometer: number;

  @IsNumber()
  @IsNotEmpty()
  station: number;

  @IsString()
  @IsNotEmpty()
  status_ai: string;

  @IsString()
  @IsNotEmpty()
  status_jalan: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => FormSurveyDto)
  FORM_SURVEY?: FormSurveyDto;

  @IsBoolean()
  @IsNotEmpty()
  downloadable: boolean
}