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
  Header,
  Res,
} from '@nestjs/common';
import { FinalReportService } from './final-report.service';
import {
  CreateFinalReportDto,
  FormSurveyDto,
  ResponseFinalReport,
} from './dto/create-final-report.dto';
import { UpdateFinalReportDto } from './dto/update-final-report.dto';
import { WebResponse } from 'src/model/web.model';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Response } from 'express';

@Controller('final-report')
export class FinalReportController {
  constructor(private readonly finalReportService: FinalReportService) {}

  @Get('/download/:guid_survey')
  @Header('Content-Type',  'text/xlsx')
  async getDownloadToExcel(@Param('guid_survey') guid_survey: string, @Res() res: Response): Promise<any> {
    try{
      const filePath = await this.finalReportService.downloadToExcel(guid_survey, res);

    }catch(error){
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  
  @Get('/download/formsurvey/:guid_survey')
  @Header('Content-Type', 'text/xlsx')
  async FormToExcel(@Param('guid_survey') guid_survey: string, @Res() res: Response): Promise<any> {
    try{
      const filePath = await this.finalReportService.FormToExcel(guid_survey, res);

    }catch(error){
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }


  @Post('/add')
  async create(
    @Body() createFinalReportDto: CreateFinalReportDto,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.create(createFinalReportDto);
      return {
        success: true,
        message: 'Berhasil dibuat',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal dibuat',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get/kurasi/:guid_rute')
  async findKurasiByGuidRute(
    @Param('guid_rute') guid_rute: string,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result =
        await this.finalReportService.findKurasiByGuidRute(guid_rute);
      return {
        success: true,
        message: 'Data berhasil diambil',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal mendapatkan data',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/getAll')
  async getAllGuidRute(): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result = await this.finalReportService.allGuidRuteunik();
      return {
        success: true,
        message: 'Data berhasil diambil',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal mendapatkan data',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get')
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result = await this.finalReportService.findAll(query);
      return {
        success: true,
        message: 'Data berhasil diambil',
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
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/kordinate')
  async findAllKordinate(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result = await this.finalReportService.findAllkordinate(query);
      return {
        success: true,
        message: 'Data berhasil diambil',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/:id')
  async getById(
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.findById(id);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/rute/:rute')
  async getByRute(
    @Param('rute') rute: string,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.findByRute(rute);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/rute_tgl/:rute/:tanggal_survey')
  async getByRuteTgl(
    @Param('tanggal_survey') tanggal_survey: string,
    @Param('rute') rute: string,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result = await this.finalReportService.findByRouteTgl(
        tanggal_survey,
        rute,
      );
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/tgl_survey/:tanggal_survey')
  async getByTglSurvey(
    @Param('tanggal_survey') tanggal_survey: string,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result =
        await this.finalReportService.findByTglSurvey(tanggal_survey);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/guid_rute/:guid_rute')
  async getByGuidRute(
    @Param('guid_rute') guid_rute: string,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.findByGuidRute(guid_rute);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/query/:guid_survey')
  async findQueryByGuidSurvey(
    @Param('guid_survey') guid_survey: string,
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result = await this.finalReportService.findQueryByGuidSurvey(
        guid_survey,
        query,
      );
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
          message: error.message,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/guid_survey/:guid_survey')
  async getByGuidSurveyAll(
    @Param('guid_survey') guid_survey: string,
  ): Promise<WebResponse<ResponseFinalReport[]>> {
    try {
      const result =
        await this.finalReportService.findByGuidSurvey(guid_survey);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Data tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateFinalReportDto: UpdateFinalReportDto,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.update(
        id,
        updateFinalReportDto,
      );
      return {
        success: true,
        message: 'Data berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal memperbarui data',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/update/formSurvey/:id')
  async updateFormSurvey(
    @Param('id') id: string,
    @Body() formSurveyDto: FormSurveyDto,
  ): Promise<WebResponse<ResponseFinalReport>> {
    try {
      const result = await this.finalReportService.updateFormSurvey(
        id,
        formSurveyDto,
      );
      return {
        success: true,
        message: 'Data berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    try {
      await this.finalReportService.remove(id);
      return {
        success: true,
        message: 'Data berhasil dihapus',
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal menghapus data',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
