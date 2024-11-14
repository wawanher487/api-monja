import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, SurveyResponse } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { WebResponse } from 'src/model/web.model';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post('add')
  async create(
    @Body() createSurveyDto: CreateSurveyDto,
  ): Promise<WebResponse<SurveyResponse>> {
    try {
      const result = await this.surveyService.create(createSurveyDto);

      return {
        success: true,
        message: 'berhasil dibuat',
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'gagal dibuat',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get')
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<SurveyResponse[]>> {
    try {
      const result = await this.surveyService.findAll(query);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result.data,
        statusCode: HttpStatus.OK,
        page: result.page,
        totalPage: result.totalPage,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal mendapatkan data',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/:id')
  async findById(
    @Param('id') id: string,
  ): Promise<WebResponse<SurveyResponse>> {
    try {
      const result = await this.surveyService.findId(id);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan ID ${id} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Survey dengan ID ${id} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/guid/:guid')
  async findByGuid(
    @Param('guid') guid_survey: string,
  ): Promise<WebResponse<SurveyResponse>> {
    try {
      const result = await this.surveyService.findGuid(guid_survey);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan GUID ${guid_survey} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Survey dengan GUID ${guid_survey} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ): Promise<WebResponse<SurveyResponse>> {
    try {
      const result = await this.surveyService.update(id, updateSurveyDto);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan ID ${id} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Survey dengan ID ${id} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/guid/:guid_survey')
  async updateByGuid(
    @Param('guid_survey') guid_survey: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ): Promise<WebResponse<SurveyResponse>> {
    try {
      const result = await this.surveyService.updateByGuid(
        guid_survey,
        updateSurveyDto,
      );
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan GUID ${guid_survey} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Survey dengan GUID ${guid_survey} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    try {
      const result = await this.surveyService.remove(id);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan ID ${id} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil dihapus',
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Gagal menghapus rute dengan ID ${id}`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete/guid/:guid_survey')
  async removeByGuid(
    @Param('guid_survey') guid_survey: string,
  ): Promise<WebResponse<null>> {
    try {
      const result = await this.surveyService.removeByGuid(guid_survey);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: `Survey dengan GUID ${guid_survey} tidak ditemukan`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Survey berhasil dihapus',
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Gagal menghapus rute dengan GUID ${guid_survey}`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
