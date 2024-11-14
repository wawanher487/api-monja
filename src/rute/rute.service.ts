import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyGuidResponse, CreateRouteDto } from './dto/create-rute.dto';
import { UpdateRuteDto } from './dto/update-rute.dto';
import { Rute } from '../schemas/rute.schema';
import { Model } from 'mongoose';
import { RuteResponse } from './dto/create-rute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'express-serve-static-core';

@Injectable()
export class RuteService {
  constructor(
    @InjectModel(Rute.name)
    private ruteModel: Model<Rute>,
  ) {}

  private mapToRuteResponse(rute: Rute): RuteResponse {
    return {
      id: rute._id.toString(),
      GUID: rute.GUID,
      RUAS: rute.RUAS.map(([lat, long]) => ({ lat, long })),
      KETERANGAN: rute.KETERANGAN.join(', '),
      NO_RUAS: rute.NO_RUAS,
      NAMA_RUAS_JALAN: rute.NAMA_RUAS_JALAN,
      KECAMATAN_YANG_DILALUI: rute.KECAMATAN_YANG_DILALUI,
      COMPANY: rute.COMPANY,
    };
  }

  async create(createRuteDto: CreateRouteDto): Promise<RuteResponse> {
    const rute = await this.ruteModel.create({
      ...createRuteDto,
      GUID: uuidv4(),
    });
    return this.mapToRuteResponse(rute);
  }

  async findAll(
    query: Query,
  ): Promise<{ data: RuteResponse[]; page: number; totalPage: number }> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const filter = query.keyword
      ? {
          COMPANY: query.keyword,
        }
      : {};

    const total = await this.ruteModel.countDocuments(filter);
    const rutes = await this.ruteModel
      .find(filter)
      .limit(resPerPage)
      .skip(skip);

    const mapRutes = rutes.map((rute) => this.mapToRuteResponse(rute));
    const totalPages = Math.ceil(total / resPerPage);

    if (currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }

    return {
      data: mapRutes,
      page: currentPage,
      totalPage: totalPages,
    };
  }

  async findAllCompany(query: Query): Promise<CompanyGuidResponse[]> {
    const filter = query.keyword
      ? {
          COMPANY: query.keyword,
        }
      : {};

    const rutes = await this.ruteModel.find(filter).select('COMPANY GUID NAMA_RUAS_JALAN');

    return rutes.map((rute) => ({
      COMPANY: rute.COMPANY,
      GUID: rute.GUID,
      NAMA_RUAS_JALAN: rute.NAMA_RUAS_JALAN
    }));
  }

  async findById(id: string): Promise<RuteResponse> {
    const rute = await this.ruteModel.findById(id);
    if (!rute) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return this.mapToRuteResponse(rute);
  }

  async findByGuid(guid: string): Promise<RuteResponse> {
    const rute = await this.ruteModel.findOne({ GUID: guid });
    if (!rute) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return this.mapToRuteResponse(rute);
  }

  async updateById(
    id: string,
    updateRuteDto: UpdateRuteDto,
  ): Promise<RuteResponse> {
    const rute = await this.ruteModel.findByIdAndUpdate(id, updateRuteDto, {
      new: true,
      runValidators: true,
    });
    if (!rute) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return this.mapToRuteResponse(rute);
  }

  async updateByGuid(
    guid: string,
    updateRuteDto: UpdateRuteDto,
  ): Promise<RuteResponse> {
    const rute = await this.ruteModel.findOneAndUpdate(
      { GUID: guid },
      updateRuteDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!rute) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return this.mapToRuteResponse(rute);
  }

  async removeById(id: string): Promise<string> {
    const result = await this.ruteModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return 'Data berhasil dihapus';
  }

  async removeByGuid(guid: string): Promise<string> {
    const result = await this.ruteModel.findOneAndDelete({ GUID: guid });
    if (!result) {
      throw new NotFoundException('Data Rute Tidak Ditemukan');
    }
    return 'Data berhasil dihapus';
  }

}
