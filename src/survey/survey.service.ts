import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto, SurveyResponse } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Survey } from 'src/schemas/survey.schema';
import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'express-serve-static-core';


@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: mongoose.Model<Survey>,
  ) {}

  private mapToRuteResponse(survey: Survey): SurveyResponse {
    return {
      id: survey._id.toString(),
      guid_survey: survey.guid_survey,
      surveyor: survey.surveyor,
      uploader: survey.uploader,
      rute: survey.rute,
      tanggal_survey: survey.tanggal_survey,
      kamera: survey.kamera,
      namafiles: survey.namafiles,
      status: survey.status,
      tanggal_upload: survey.tanggal_upload,
      guid_rute: survey.guid_rute,
    };
  }

  async create(createSurveyDto: CreateSurveyDto): Promise<SurveyResponse> {
    const survey = await this.surveyModel.create({
      ...createSurveyDto,
      guid_survey: uuidv4(),
      guid_rute: uuidv4(),
    });
    return this.mapToRuteResponse(survey);
  }

  async findAll(
    query: Query,
  ): Promise<{ data: SurveyResponse[]; page: number; totalPage: number }> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keywoard = query.keywoard
      ? {
          rute: {
            $regex: query.keywoard,
            $options: 'i',
          },
        }
      : {};

    const total = await this.surveyModel.countDocuments(keywoard);
    const surveys = await this.surveyModel
      .find({ ...keywoard })
      .limit(resPerPage)
      .skip(skip);

    const mapSurveys = surveys.map((survey) => this.mapToRuteResponse(survey));
    const totalPages = Math.ceil(total / resPerPage);

    if (currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }
    
    return {
      data: mapSurveys,
      page: currentPage,
      totalPage: totalPages,
    };
  }

  async findId(id: string): Promise<SurveyResponse> {
    const survey = await this.surveyModel.findById(id).populate('guid_rute');

    if (!survey) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    }
    return this.mapToRuteResponse(survey);
  }

  async findGuid(guid_survey: string): Promise<SurveyResponse> {
    const survey = await this.surveyModel.findOne({ guid_survey });

    if (!survey) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    }
    return this.mapToRuteResponse(survey);
  }

  async update(
    id: string,
    updateSurveyDto: UpdateSurveyDto,
  ): Promise<SurveyResponse> {
    const result = await this.surveyModel
      .findByIdAndUpdate(id, updateSurveyDto, {
        new: true,
        runValidators: true,
      })
      .populate('guid_rute');

    if (!result) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    }

    return this.mapToRuteResponse(result);
  }

  async updateByGuid(
    guid_survey: string,
    updateSurveyDto: UpdateSurveyDto,
  ): Promise<SurveyResponse> {
    const result = await this.surveyModel
      .findOneAndUpdate({ guid_survey }, updateSurveyDto, {
        new: true,
        runValidators: true,
      })
      .populate('guid_rute');

    if (!result) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    }

    return this.mapToRuteResponse(result);
  }

  async remove(id: string) {
    const result = await this.surveyModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    } else {
      return 'data berhasil dihapus';
    }
  }

  async removeByGuid(guid_survey: string) {
    const result = await this.surveyModel.findOneAndDelete([guid_survey]);
    if (!result) {
      throw new NotFoundException('Data Survey Tidak Ditemukan');
    } else {
      return 'data berhasil dihapus';
    }
  }
}
