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
  NotFoundException,
} from '@nestjs/common';
import { RuteService } from './rute.service';
import { CompanyGuidResponse, CreateRouteDto } from './dto/create-rute.dto';
import { UpdateRuteDto } from './dto/update-rute.dto';
import { RuteResponse } from './dto/create-rute.dto';
import { WebResponse } from 'src/model/web.model';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('rute')
export class RuteController {
  constructor(private readonly ruteService: RuteService) {}

  @Post('/add')
  async create(
    @Body() createRuteDto: CreateRouteDto,
  ): Promise<WebResponse<RuteResponse>> {
    try {
      const result = await this.ruteService.create(createRuteDto);

      return {
        success: true,
        message: 'Rute berhasil dibuat',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Gagal membuat rute',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get')
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<RuteResponse[]>> {
    try {
      const result = await this.ruteService.findAll(query);
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
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/company')
  async findAllCompany(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<CompanyGuidResponse[]>> {
    try {
      const result = await this.ruteService.findAllCompany(query);
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
          message: 'Gagal mendapatkan data',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/:id')
  async getById(@Param('id') id: string): Promise<WebResponse<RuteResponse>> {
    try {
      const result = await this.ruteService.findById(id);
      return {
        success: true,
        message: 'Rute berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Rute dengan ID ${id} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/guid/:guid')
  async getByGuid(
    @Param('guid') guid_rute: string,
  ): Promise<WebResponse<RuteResponse>> {
    try {
      const result = await this.ruteService.findByGuid(guid_rute); // Perbaikan method dari 'findGuid' menjadi 'findByGuid'
      return {
        success: true,
        message: 'Rute berhasil ditemukan',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Rute dengan Guid ${guid_rute} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/:id')
  async updateById(
    @Param('id') id: string,
    @Body() updateRuteDto: UpdateRuteDto,
  ): Promise<WebResponse<RuteResponse>> {
    try {
      const result = await this.ruteService.updateById(id, updateRuteDto);
      return {
        success: true,
        message: 'Rute berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Rute dengan ID ${id} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/guid/:guid_rute')
  async updateByGuid(
    @Param('guid_rute') guid_rute: string,
    @Body() updateRuteDto: UpdateRuteDto,
  ): Promise<WebResponse<RuteResponse>> {
    try {
      const result = await this.ruteService.updateByGuid(
        guid_rute,
        updateRuteDto,
      );
      return {
        success: true,
        message: 'Rute berhasil diperbarui',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Rute dengan Guid ${guid_rute} tidak ditemukan`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    try {
      await this.ruteService.removeById(id);
      return {
        success: true,
        message: 'Rute berhasil dihapus',
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Gagal menghapus rute dengan ID ${id}`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('/delete/guid/:guid_rute')
  async removeByGuid(
    @Param('guid_rute') guid_rute: string,
  ): Promise<WebResponse<null>> {
    try {
      await this.ruteService.removeByGuid(guid_rute); // Menghapus pengecekan result karena findOneAndDelete sudah melemparkan exception jika tidak ditemukan
      return {
        success: true,
        message: 'Rute berhasil dihapus',
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new NotFoundException(`Rute dengan Guid ${guid_rute} tidak ditemukan`);
    }
  }
}
