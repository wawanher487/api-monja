import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyDto } from './create-survey.dto';
import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';


export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {
  @IsString()
  @IsNotEmpty()
  readonly surveyor: string;

  @IsString()
  @IsNotEmpty()
  readonly uploader: string;

  @IsString()
  @IsNotEmpty()
  readonly rute: string;

  @IsDateString()
  @IsNotEmpty()
  readonly tanggal_survey: string;

  @IsString()
  @IsNotEmpty()
  readonly kamera: string;

  @IsString()
  @IsNotEmpty()
  readonly namafiles: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsDateString()
  @IsNotEmpty()
  readonly tanggal_upload: string;
}
