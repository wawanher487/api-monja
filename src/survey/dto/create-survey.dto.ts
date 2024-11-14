import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  surveyor: string;

  @IsString()
  @IsNotEmpty()
  uploader: string;

  @IsString()
  @IsNotEmpty()
  rute: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_survey: String;

  @IsString()
  @IsNotEmpty()
  kamera: string;

  @IsString()
  @IsNotEmpty()
  namafiles: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_upload: String;

  @IsString()
  @IsOptional()
  guid_rute: string;
}

export class SurveyResponse {
  @IsString()
  guid_survey: string;

  @IsString()
  @IsNotEmpty()
  surveyor: string;

  @IsString()
  @IsNotEmpty()
  uploader: string;

  @IsString()
  @IsNotEmpty()
  rute: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_survey: String;

  @IsString()
  @IsNotEmpty()
  kamera: string;

  @IsString()
  @IsNotEmpty()
  namafiles: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_upload: string;

  @IsString()
  @IsOptional()
  guid_rute?: string;

  @IsString()
  id: string;
}
