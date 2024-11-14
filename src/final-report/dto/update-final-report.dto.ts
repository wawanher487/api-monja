import { PartialType } from '@nestjs/mapped-types';

import {
  IsBoolean,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFinalReportDto } from './create-final-report.dto';

class SurfaceHardnessDto {
  @IsString()
  @IsNotEmpty()
  ORDER?: string;

  @IsString()
  @IsNotEmpty()
  CONDITION?: string;

  @IsString()
  @IsNotEmpty()
  DECREASE?: string;

  @IsString()
  @IsNotEmpty()
  PATCHES?: string;
}

class CracksDto {
  @IsString()
  @IsNotEmpty()
  TYPE?: string;

  @IsString()
  @IsNotEmpty()
  WIDE?: string;

  @IsString()
  @IsNotEmpty()
  LARGE?: string;
}

class OtherDamageDto {
  @IsString()
  @IsNotEmpty()
  HOLE_NUMBER?: string;

  @IsString()
  @IsNotEmpty()
  HOLE_SIZE?: string;

  @IsString()
  @IsNotEmpty()
  EX_WHEEL?: string;

  @IsString()
  @IsNotEmpty()
  LEFT_DAMAGE_EDGE?: string;

  @IsString()
  @IsNotEmpty()
  RIGHT_DAMAGE_EDGE?: string;
}

class ShoulderChannelSideDto {
  @IsString()
  @IsNotEmpty()
  LEFT_SHOULDER_CONDITION?: string;

  @IsString()
  @IsNotEmpty()
  RIGHT_SHOULDER_CONDITION?: string;

  @IsString()
  @IsNotEmpty()
  LEFT_SHOULDER_SURFACE?: string;

  @IsString()
  @IsNotEmpty()
  RIGHT_SHOULDER_SURFACE?: string;

  @IsString()
  @IsNotEmpty()
  LEFT_CHANNEL_SIDE_CONDITION?: string;

  @IsString()
  @IsNotEmpty()
  RIGHT_CHANNEL_SIDE_CONDITION?: string;

  @IsString()
  @IsNotEmpty()
  DAMAGE_SLOPE_LEFT?: string;

  @IsString()
  @IsNotEmpty()
  DAMAGE_SLOPE_RIGHT?: string;

  @IsString()
  @IsNotEmpty()
  SIDEWALK_LEFT?: string;

  @IsString()
  @IsNotEmpty()
  SIDEWALK_RIGHT?: string;
}

class SDICalculationDto {
  @IsNumber()
  @IsNotEmpty()
  RETAK_LUAS?: number;

  @IsNumber()
  @IsNotEmpty()
  RETAK_LEBAR?: number;

  @IsNumber()
  @IsNotEmpty()
  JUMLAH_LUBANG?: number;

  @IsNumber()
  @IsNotEmpty()
  BEKAS_RODA?: number;
}

class PanjangKondisiDto {
  @IsNumber()
  @IsNotEmpty()
  BAIK?: number;

  @IsNumber()
  @IsNotEmpty()
  SEDANG?: number;

  @IsNumber()
  @IsNotEmpty()
  RUSAK_RINGAN?: number;

  @IsNumber()
  @IsNotEmpty()
  RUSAK_BERAT?: number;
}

class KemantapanDto {
  @IsNumber()
  @IsNotEmpty()
  MANTAP?: number;

  @IsNumber()
  @IsNotEmpty()
  TIDAK_MANTAP?: number;
}

export class FormSurveyDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => SurfaceHardnessDto)
  SURFACE_HARDNESS?: SurfaceHardnessDto;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CracksDto)
  CRACKS?: CracksDto;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => OtherDamageDto)
  OTHER_DAMAGE?: OtherDamageDto;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShoulderChannelSideDto)
  SHOULDER_CHANNEL_SIDE?: ShoulderChannelSideDto;

  @IsBoolean()
  @IsNotEmpty()
  CEK_STATUS_ENTRY?: boolean;

  @IsString()
  @IsNotEmpty()
  Status_jalan?: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => SDICalculationDto)
  SDI_Calculation?: SDICalculationDto;

  @IsNumber()
  @IsNotEmpty()
  NILAI_SDI?: number;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  Data_Angka?: number[];

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PanjangKondisiDto)
  PANJANG_KONDISI?: PanjangKondisiDto;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => KemantapanDto)
  KEMANTAPAN?: KemantapanDto;

  @IsString()
  @IsNotEmpty()
  JENIS_PENANGANAN?: string;

  @IsNumber()
  @IsNotEmpty()
  IRI?: number;
}

export class UpdateFinalReportDto extends PartialType(CreateFinalReportDto) {
  @IsString()
  namafile?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinate?: number[];

  @IsString()
  guid_survey?: string;

  @IsString()
  original_file_video?: string;

  @IsString()
  surveyor?: string;

  @IsString()
  uploader?: string;

  @IsString()
  kamera?: string;

  @IsString()
  rute?: string;

  @IsString()
  guid_rute?: string;

  @IsString()
  tanggal_survey?: string;

  @IsString()
  tanggal_upload?: string;

  @IsNumber()
  kilometer?: number;

  @IsNumber()
  station?: number;

  @IsString()
  status_ai?: string;

  @IsString()
  status_jalan?: string;

  @ValidateNested()
  @Type(() => FormSurveyDto)
  FORM_SURVEY?: FormSurveyDto;

  @IsBoolean()
  downloadable?: boolean;
}
