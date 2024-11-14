import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateRouteDto } from './create-rute.dto';

export class UpdateRuteDto extends PartialType(CreateRouteDto) {
  @IsArray()
  RUAS: number[][];

  @IsArray()
  @IsString({ each: true })
  KETERANGAN: string[];

  @IsString()
  @IsNotEmpty()
  COMPANY: string;

  @IsNotEmpty()
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
