import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateRouteDto {
  @IsArray()
  @ArrayNotEmpty()
  RUAS: number[][];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  KETERANGAN: string[];

  @IsString()
  @IsNotEmpty()
  COMPANY: string;

  @IsUUID()
  @IsOptional()
  GUID: string;

  @IsString()
  @IsNotEmpty()
  NO_RUAS: string;

  @IsString()
  @IsNotEmpty()
  NAMA_RUAS_JALAN: string;

  @IsString()
  @IsNotEmpty()
  KECAMATAN_YANG_DILALUI: string;
}

export class RuteResponse {
  @IsString()
  GUID: string;

  @IsString()
  NO_RUAS: string;

  @IsString()
  NAMA_RUAS_JALAN: string;

  @IsArray()
  RUAS: { long: number; lat: number }[];

  @IsString()
  KECAMATAN_YANG_DILALUI: string;

  @IsString()
  KETERANGAN?: string;

  @IsString()
  COMPANY: string;

  @IsString()
  id: string;
}

export class CompanyGuidResponse {
  @IsString()
  GUID: string;

  @IsString()
  NAMA_RUAS_JALAN: string;

  @IsString()
  COMPANY: string;
}
