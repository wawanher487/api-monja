import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateFinalReportDto,
  FormSurveyDto,
  ResponseFinalReport,
} from './dto/create-final-report.dto';
import { UpdateFinalReportDto } from './dto/update-final-report.dto';
import { FinalReport } from 'src/schemas/final-report.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';
import { Query } from 'express-serve-static-core';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class FinalReportService {
  constructor(
    @InjectModel(FinalReport.name) private finalReportModel: Model<FinalReport>,
  ) {}

  async downloadToExcel(guid_survey: string, res: Response) {
    const report = await this.finalReportModel.find({guid_survey}).lean();

    if(report.length === 0) {
      throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Final Report');

    //define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Nama File', key: 'namafile', width: 30 },
      { header: 'Coordinate', key: 'coordinate', width: 30 },
      { header: 'GUID Survey', key: 'guid_survey', width: 40 },
      { header: 'File Video', key: 'original_file_video', width: 25 },
      { header: 'Surveyor', key: 'surveyor', width: 30 },
      { header: 'Uploader', key: 'uploader', width: 25 },
      { header: 'Kamera', key: 'kamera', width: 25 },
      { header: 'Rute', key: 'rute', width: 25 },
      { header: 'GUID Rute', key: 'guid_rute', width: 40 },
      { header: 'Tanggal Survey', key: 'tanggal_survey', width: 25 },
      { header: 'Tanggal Upload', key: 'tanggal_upload', width: 25},
      { header: 'Kilometer', key: 'kilometer', width: 20 },
      { header: 'Station', key: 'station', width: 20 },
      { header: 'Status AI', key: 'status_ai', width: 20 },
      { header: 'Status Jalan', key: 'status_jalan', width: 20 },
      { header: 'Downloadable', key: 'downloadable', width: 20 },
    ];

    //style header row
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF'} };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472c4' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    })

    report.forEach(report => {
      worksheet.addRow({
        id: report._id.toString(),
        namafile: report.namafile,
        coordinate: report.coordinate,
        guid_survey: report.guid_survey,
        original_file_video: report.original_file_video,
        surveyor: report.surveyor,
        uploader: report.uploader,
        kamera: report.kamera,
        rute: report.rute,
        guid_rute: report.guid_rute,
        tanggal_survey: report.tanggal_survey,
        tanggal_upload: report.tanggal_upload,
        kilometer: report.kilometer,
        station: report.station,
        status_ai: report.status_ai,
        status_jalan: report.status_jalan,
        downloadable: report.downloadable,
      });
    });

    //Form Survey
    const worksheet1 = workbook.addWorksheet('Form Survey');

    //define columns with sub-headers
    worksheet1.columns = [
      //surface hardness
      { header: 'Order', key: 'surface_hardness_order', width: 20 },
      { header: 'Condition', key: 'surface_hardness_condition', width: 20 },
      { header: 'Decrease', key: 'surface_hardness_decrease', width: 20 },
      { header: 'Patches', key: 'surface_hardness_patches', width: 20 },

    
      // Cracks
      { header: 'Type', key: 'cracks_type', width: 20 },
      { header: 'Wide', key: 'cracks_wide', width: 20 },
      { header: 'Large', key: 'cracks_large', width: 20 },

      // Other Damage
      { header: 'Hole Number', key: 'other_damage_hole_number', width: 20 },
      { header: 'Hole Size', key: 'other_damage_hole_size', width: 20 },
      { header: 'Ex Wheel', key: 'other_damage_ex_wheel', width: 20 },
      { header: 'Left Damage Edge', key: 'other_damage_left_damage_edge', width: 20 },
      { header: 'Right Damage Edge', key: 'other_damage_right_damage_edge', width: 20 },

      // Shoulder Channel Side
      { header: 'Left Shoulder Condition', key: 'shoulder_left_shoulder_condition', width: 30 },
      { header: 'Right Shoulder Condition', key: 'shoulder_right_shoulder_condition', width: 30 },
      { header: 'Left Shoulder Surface', key: 'shoulder_left_shoulder_surface', width: 30 },
      { header: 'Right Shoulder Surface', key: 'shoulder_right_shoulder_surface', width: 30 },
      { header: 'Left Channel Side Condition', key: 'shoulder_left_channel_side_condition', width: 30 },
      { header: 'Right Channel Side Condition', key: 'shoulder_right_channel_side_condition', width: 30 },
      { header: 'Damage Slope Left', key: 'shoulder_damage_slope_left', width: 30 },
      { header: 'Damage Slope Right', key: 'shoulder_damage_slope_right', width: 30 },
      { header: 'Sidewalk Left', key: 'shoulder_sidewalk_left', width: 30 },
      { header: 'Sidewalk Right', key: 'shoulder_sidewalk_right', width: 30 },

      // SDI Calculation
      { header: 'Retak Luas', key: 'sdi_retak_luas', width: 20 },
      { header: 'Retak Lebar', key: 'sdi_retak_lebar', width: 20 },
      { header: 'Jumlah Lubang', key: 'sdi_jumlah_lubang', width: 20 },
      { header: 'Bekas Roda', key: 'sdi_bekas_roda', width: 20 },

      // Additional fields in FormSurvey
      { header: 'CEK STATUS ENTRY', key: 'cek_status_entry', width: 20 },
      { header: 'Status Jalan', key: 'status_jalan', width: 15 },
      { header: 'Nilai SDI', key: 'nilai_sdi', width: 15 },
      { header: 'Data Angka', key: 'data_angka', width: 30 }, 

      // Panjang Kondisi
      { header: 'Baik', key: 'panjang_kondisi_baik', width: 20 },
      { header: 'Sedang', key: 'panjang_kondisi_sedang', width: 20 },
      { header: 'Rusak Ringan', key: 'panjang_kondisi_rusak_ringan', width: 20 },
      { header: 'Rusak Berat', key: 'panjang_kondisi_rusak_berat', width: 20 },

      // Kemantapan
      { header: 'Mantap', key: 'kemantapan_mantap', width: 15 },
      { header: 'Tidak Mantap', key: 'kemantapan_tidak_mantap', width: 15 },

      { header: 'Jenis Penanganan', key: 'jenis_penanganan', width: 25 },
      { header: 'IRI', key: 'iri', width: 10 },
    ]

    // set Coloumn header
    worksheet1.mergeCells('A1:D1');
    worksheet1.getCell('A1').value = 'Surface Hardness';
    worksheet1.getCell('A2').value = 'Order';
    worksheet1.getCell('B2').value = 'Condition';
    worksheet1.getCell('C2').value = 'Decrease';
    worksheet1.getCell('D2').value = 'Patches';

    worksheet1.mergeCells('E1:G1');
    worksheet1.getCell('E1').value = 'Cracks';
    worksheet1.getCell('E2').value = 'Type';
    worksheet1.getCell('F2').value = 'Wide';
    worksheet1.getCell('G2').value = 'Large';

    worksheet1.mergeCells('H1:L1');
    worksheet1.getCell('H1').value = 'Other Damage';
    worksheet1.getCell('H2').value = 'Hole Number';
    worksheet1.getCell('I2').value = 'Hole Size';
    worksheet1.getCell('J2').value = 'Ex Wheel';
    worksheet1.getCell('K2').value = 'Left Damage Edge';
    worksheet1.getCell('L2').value = 'Right Damage Edge';

    worksheet1.mergeCells('M1:V1');
    worksheet1.getCell('M1').value = 'Shoulder Channel Side';
    worksheet1.getCell('M2').value = 'Left Shoulder Condition';
    worksheet1.getCell('N2').value = 'Right Shoulder Condition';
    worksheet1.getCell('O2').value = 'Left Shoulder Surface';
    worksheet1.getCell('P2').value = 'Right Shoulder Surface';
    worksheet1.getCell('Q2').value = 'Left Channel Side Condition';
    worksheet1.getCell('R2').value = 'Right Channel Side Condition';
    worksheet1.getCell('S2').value = 'Damage Slope Left';
    worksheet1.getCell('T2').value = 'Damage Slope Right';
    worksheet1.getCell('U2').value = 'Sidewalk Left';
    worksheet1.getCell('V2').value = 'Sidewalk Right';

    worksheet1.mergeCells('W1:Z1');
    worksheet1.getCell('W1').value = 'SDI Calculation';
    worksheet1.getCell('W2').value = 'Retak Luas';
    worksheet1.getCell('X2').value = 'Retak Lebar';
    worksheet1.getCell('Y2').value = 'Jumlah Lubang';
    worksheet1.getCell('Z2').value = 'Bekas Roda';

    worksheet1.mergeCells('AA1:AA2');
    worksheet1.getCell('AA1').value = 'CEK STATUS ENTRY';

    worksheet1.mergeCells('AB1:AB2');
    worksheet1.getCell('AB1').value = 'Status Jalan';

    worksheet1.mergeCells('AC1:AC2');
    worksheet1.getCell('AC1').value = 'Nilai SDI';

    worksheet1.mergeCells('AD1:AD2');
    worksheet1.getCell('AD1').value = 'Data Angka';

    worksheet1.mergeCells('AE1:AH1');
    worksheet1.getCell('AE1').value = 'Panjang Kondisi';
    worksheet1.getCell('AE2').value = 'Baik';
    worksheet1.getCell('AF2').value = 'Sedang';
    worksheet1.getCell('AG2').value = 'Rusak Ringan';
    worksheet1.getCell('AH2').value = 'Rusak Berat';

    worksheet1.mergeCells('AI1:AJ1');
    worksheet1.getCell('AI1').value = 'Kemantapan';
    worksheet1.getCell('AI2').value = 'Mantap';
    worksheet1.getCell('AJ2').value = 'Tidak Mantap';

    worksheet1.mergeCells('AK1:AK2')
    worksheet1.getCell('AK1').value = 'Jenis Penanganan';

    worksheet1.mergeCells('AL1:AL2')
    worksheet1.getCell('AL1').value = 'IRI';
    
    // Setting style for individual headers
    [worksheet1.getRow(1), worksheet1.getRow(2)].forEach((row) => {
      row.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
      });
    });

    
    //add data rows
    report.forEach((data) => {
      const formSurvey = data.FORM_SURVEY

      worksheet1.addRow({
        //surface hardness
        surface_hardness_order: formSurvey.SURFACE_HARDNESS.ORDER,
        surface_hardness_condition: formSurvey.SURFACE_HARDNESS.CONDITION,
        surface_hardness_decrease: formSurvey.SURFACE_HARDNESS.DECREASE,
        surface_hardness_patches: formSurvey.SURFACE_HARDNESS.PATCHES,

        //Cracks
        cracks_type: formSurvey.CRACKS.TYPE,
        cracks_wide: formSurvey.CRACKS.WIDE,
        cracks_large: formSurvey.CRACKS.LARGE,

        //Other damage
        other_damage_hole_number: formSurvey.OTHER_DAMAGE.HOLE_NUMBER,
        other_damage_hole_size: formSurvey.OTHER_DAMAGE.HOLE_SIZE,
        other_damage_ex_wheel: formSurvey.OTHER_DAMAGE.EX_WHEEL,
        other_damage_left_damage_edge: formSurvey.OTHER_DAMAGE.LEFT_DAMAGE_EDGE,
        other_damage_right_damage_edge: formSurvey.OTHER_DAMAGE.RIGHT_DAMAGE_EDGE,

        // Shoulder Channel Side
        shoulder_left_shoulder_condition: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_SHOULDER_CONDITION,
        shoulder_right_shoulder_condition: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_SHOULDER_CONDITION,
        shoulder_left_shoulder_surface: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_SHOULDER_SURFACE,
        shoulder_right_shoulder_surface: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_SHOULDER_SURFACE,
        shoulder_left_channel_side_condition: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_CHANNEL_SIDE_CONDITION,
        shoulder_right_channel_side_condition: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_CHANNEL_SIDE_CONDITION,
        shoulder_damage_slope_left: formSurvey.SHOULDER_CHANNEL_SIDE.DAMAGE_SLOPE_LEFT,
        shoulder_damage_slope_right: formSurvey.SHOULDER_CHANNEL_SIDE.DAMAGE_SLOPE_RIGHT,
        shoulder_sidewalk_left: formSurvey.SHOULDER_CHANNEL_SIDE.SIDEWALK_LEFT,
        shoulder_sidewalk_right: formSurvey.SHOULDER_CHANNEL_SIDE.SIDEWALK_RIGHT,

        //SDI Calculation
        sdi_retak_luas: formSurvey.SDI_Calculation.RETAK_LUAS,
        sdi_retak_lebar: formSurvey.SDI_Calculation.RETAK_LEBAR,
        sdi_jumlah_lubang: formSurvey.SDI_Calculation.JUMLAH_LUBANG,
        sdi_bekas_roda: formSurvey.SDI_Calculation.BEKAS_RODA,

        //additional fields
        cek_status_entry: formSurvey.CEK_STATUS_ENTRY,
        status_jalan: formSurvey.Status_jalan,
        nilai_sdi: formSurvey.NILAI_SDI,
        data_angka: formSurvey.Data_Angka,

        //Panjang kondisi
        panjang_kondisi_baik: formSurvey.PANJANG_KONDISI.BAIK,
        panjang_kondisi_sedang: formSurvey.PANJANG_KONDISI.SEDANG,
        panjang_kondisi_rusak_ringan: formSurvey.PANJANG_KONDISI.RUSAK_RINGAN,
        panjang_kondisi_rusak_berat: formSurvey.PANJANG_KONDISI.RUSAK_BERAT,

        //Kemantapan
        kemantapan_mantap: formSurvey.KEMANTAPAN.MANTAP,
        kemantapan_tidak_mantap: formSurvey.KEMANTAPAN.TIDAK_MANTAP,

        jenis_penanganan: formSurvey.JENIS_PENANGANAN,
        iri: formSurvey.IRI
      });
    });

    // Tentukan path untuk menyimpan file
    const filePath = path.join(__dirname, '..', '..', 'downloads', `final-report-${guid_survey}.xlsx`);

    // Membuat folder jika belum ada
    await fs.promises.mkdir(path.join(__dirname, '..', '..', 'downloads'), { recursive: true });

    // Menulis file Excel ke sistem
    await workbook.xlsx.writeFile(filePath);

    // Kirim file ke client untuk diunduh
     res.download(filePath, (err) => {
      if (err) {
        throw new HttpException('Error saat mendownload file', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting file: ${unlinkErr}`);
          }
        });
      }
    })
  }


  async FormToExcel(guid_survey: string, res: Response) {
    const report = await this.finalReportModel.find({guid_survey}).lean();

    if(report.length === 0) {
      throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Form Survey');

    //define columns with sub-headers
    worksheet.columns = [
      //surface hardness
      { header: 'Order', key: 'surface_hardness_order', width: 20 },
      { header: 'Condition', key: 'surface_hardness_condition', width: 20 },
      { header: 'Decrease', key: 'surface_hardness_decrease', width: 20 },
      { header: 'Patches', key: 'surface_hardness_patches', width: 20 },

    
      // Cracks
      { header: 'Type', key: 'cracks_type', width: 20 },
      { header: 'Wide', key: 'cracks_wide', width: 20 },
      { header: 'Large', key: 'cracks_large', width: 20 },

      // Other Damage
      { header: 'Hole Number', key: 'other_damage_hole_number', width: 20 },
      { header: 'Hole Size', key: 'other_damage_hole_size', width: 20 },
      { header: 'Ex Wheel', key: 'other_damage_ex_wheel', width: 20 },
      { header: 'Left Damage Edge', key: 'other_damage_left_damage_edge', width: 20 },
      { header: 'Right Damage Edge', key: 'other_damage_right_damage_edge', width: 20 },

      // Shoulder Channel Side
      { header: 'Left Shoulder Condition', key: 'shoulder_left_shoulder_condition', width: 30 },
      { header: 'Right Shoulder Condition', key: 'shoulder_right_shoulder_condition', width: 30 },
      { header: 'Left Shoulder Surface', key: 'shoulder_left_shoulder_surface', width: 30 },
      { header: 'Right Shoulder Surface', key: 'shoulder_right_shoulder_surface', width: 30 },
      { header: 'Left Channel Side Condition', key: 'shoulder_left_channel_side_condition', width: 30 },
      { header: 'Right Channel Side Condition', key: 'shoulder_right_channel_side_condition', width: 30 },
      { header: 'Damage Slope Left', key: 'shoulder_damage_slope_left', width: 30 },
      { header: 'Damage Slope Right', key: 'shoulder_damage_slope_right', width: 30 },
      { header: 'Sidewalk Left', key: 'shoulder_sidewalk_left', width: 30 },
      { header: 'Sidewalk Right', key: 'shoulder_sidewalk_right', width: 30 },

      // SDI Calculation
      { header: 'Retak Luas', key: 'sdi_retak_luas', width: 20 },
      { header: 'Retak Lebar', key: 'sdi_retak_lebar', width: 20 },
      { header: 'Jumlah Lubang', key: 'sdi_jumlah_lubang', width: 20 },
      { header: 'Bekas Roda', key: 'sdi_bekas_roda', width: 20 },

      // Additional fields in FormSurvey
      { header: 'CEK STATUS ENTRY', key: 'cek_status_entry', width: 20 },
      { header: 'Status Jalan', key: 'status_jalan', width: 15 },
      { header: 'Nilai SDI', key: 'nilai_sdi', width: 15 },
      { header: 'Data Angka', key: 'data_angka', width: 30 }, 

      // Panjang Kondisi
      { header: 'Baik', key: 'panjang_kondisi_baik', width: 20 },
      { header: 'Sedang', key: 'panjang_kondisi_sedang', width: 20 },
      { header: 'Rusak Ringan', key: 'panjang_kondisi_rusak_ringan', width: 20 },
      { header: 'Rusak Berat', key: 'panjang_kondisi_rusak_berat', width: 20 },

      // Kemantapan
      { header: 'Mantap', key: 'kemantapan_mantap', width: 15 },
      { header: 'Tidak Mantap', key: 'kemantapan_tidak_mantap', width: 15 },

      { header: 'Jenis Penanganan', key: 'jenis_penanganan', width: 25 },
      { header: 'IRI', key: 'iri', width: 10 },
    ]

    // set Coloumn header
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'Surface Hardness';
    worksheet.getCell('A2').value = 'Order';
    worksheet.getCell('B2').value = 'Condition';
    worksheet.getCell('C2').value = 'Decrease';
    worksheet.getCell('D2').value = 'Patches';

    worksheet.mergeCells('E1:G1');
    worksheet.getCell('E1').value = 'Cracks';
    worksheet.getCell('E2').value = 'Type';
    worksheet.getCell('F2').value = 'Wide';
    worksheet.getCell('G2').value = 'Large';

    worksheet.mergeCells('H1:L1');
    worksheet.getCell('H1').value = 'Other Damage';
    worksheet.getCell('H2').value = 'Hole Number';
    worksheet.getCell('I2').value = 'Hole Size';
    worksheet.getCell('J2').value = 'Ex Wheel';
    worksheet.getCell('K2').value = 'Left Damage Edge';
    worksheet.getCell('L2').value = 'Right Damage Edge';

    worksheet.mergeCells('M1:V1');
    worksheet.getCell('M1').value = 'Shoulder Channel Side';
    worksheet.getCell('M2').value = 'Left Shoulder Condition';
    worksheet.getCell('N2').value = 'Right Shoulder Condition';
    worksheet.getCell('O2').value = 'Left Shoulder Surface';
    worksheet.getCell('P2').value = 'Right Shoulder Surface';
    worksheet.getCell('Q2').value = 'Left Channel Side Condition';
    worksheet.getCell('R2').value = 'Right Channel Side Condition';
    worksheet.getCell('S2').value = 'Damage Slope Left';
    worksheet.getCell('T2').value = 'Damage Slope Right';
    worksheet.getCell('U2').value = 'Sidewalk Left';
    worksheet.getCell('V2').value = 'Sidewalk Right';

    worksheet.mergeCells('W1:Z1');
    worksheet.getCell('W1').value = 'SDI Calculation';
    worksheet.getCell('W2').value = 'Retak Luas';
    worksheet.getCell('X2').value = 'Retak Lebar';
    worksheet.getCell('Y2').value = 'Jumlah Lubang';
    worksheet.getCell('Z2').value = 'Bekas Roda';

    worksheet.mergeCells('AA1:AA2');
    worksheet.getCell('AA1').value = 'CEK STATUS ENTRY';

    worksheet.mergeCells('AB1:AB2');
    worksheet.getCell('AB1').value = 'Status Jalan';

    worksheet.mergeCells('AC1:AC2');
    worksheet.getCell('AC1').value = 'Nilai SDI';

    worksheet.mergeCells('AD1:AD2');
    worksheet.getCell('AD1').value = 'Data Angka';

    worksheet.mergeCells('AE1:AH1');
    worksheet.getCell('AE1').value = 'Panjang Kondisi';
    worksheet.getCell('AE2').value = 'Baik';
    worksheet.getCell('AF2').value = 'Sedang';
    worksheet.getCell('AG2').value = 'Rusak Ringan';
    worksheet.getCell('AH2').value = 'Rusak Berat';

    worksheet.mergeCells('AI1:AJ1');
    worksheet.getCell('AI1').value = 'Kemantapan';
    worksheet.getCell('AI2').value = 'Mantap';
    worksheet.getCell('AJ2').value = 'Tidak Mantap';

    worksheet.mergeCells('AK1:AK2')
    worksheet.getCell('AK1').value = 'Jenis Penanganan';

    worksheet.mergeCells('AL1:AL2')
    worksheet.getCell('AL1').value = 'IRI';
    
    // Setting style for individual headers
    [worksheet.getRow(1), worksheet.getRow(2)].forEach((row,index) => {
      row.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' }
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
      });
    });

    
    //add data rows
    report.forEach((data) => {
      const formSurvey = data.FORM_SURVEY

      worksheet.addRow({
        //surface hardness
        surface_hardness_order: formSurvey.SURFACE_HARDNESS.ORDER,
        surface_hardness_condition: formSurvey.SURFACE_HARDNESS.CONDITION,
        surface_hardness_decrease: formSurvey.SURFACE_HARDNESS.DECREASE,
        surface_hardness_patches: formSurvey.SURFACE_HARDNESS.PATCHES,

        //Cracks
        cracks_type: formSurvey.CRACKS.TYPE,
        cracks_wide: formSurvey.CRACKS.WIDE,
        cracks_large: formSurvey.CRACKS.LARGE,

        //Other damage
        other_damage_hole_number: formSurvey.OTHER_DAMAGE.HOLE_NUMBER,
        other_damage_hole_size: formSurvey.OTHER_DAMAGE.HOLE_SIZE,
        other_damage_ex_wheel: formSurvey.OTHER_DAMAGE.EX_WHEEL,
        other_damage_left_damage_edge: formSurvey.OTHER_DAMAGE.LEFT_DAMAGE_EDGE,
        other_damage_right_damage_edge: formSurvey.OTHER_DAMAGE.RIGHT_DAMAGE_EDGE,

        // Shoulder Channel Side
        shoulder_left_shoulder_condition: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_SHOULDER_CONDITION,
        shoulder_right_shoulder_condition: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_SHOULDER_CONDITION,
        shoulder_left_shoulder_surface: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_SHOULDER_SURFACE,
        shoulder_right_shoulder_surface: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_SHOULDER_SURFACE,
        shoulder_left_channel_side_condition: formSurvey.SHOULDER_CHANNEL_SIDE.LEFT_CHANNEL_SIDE_CONDITION,
        shoulder_right_channel_side_condition: formSurvey.SHOULDER_CHANNEL_SIDE.RIGHT_CHANNEL_SIDE_CONDITION,
        shoulder_damage_slope_left: formSurvey.SHOULDER_CHANNEL_SIDE.DAMAGE_SLOPE_LEFT,
        shoulder_damage_slope_right: formSurvey.SHOULDER_CHANNEL_SIDE.DAMAGE_SLOPE_RIGHT,
        shoulder_sidewalk_left: formSurvey.SHOULDER_CHANNEL_SIDE.SIDEWALK_LEFT,
        shoulder_sidewalk_right: formSurvey.SHOULDER_CHANNEL_SIDE.SIDEWALK_RIGHT,

        //SDI Calculation
        sdi_retak_luas: formSurvey.SDI_Calculation.RETAK_LUAS,
        sdi_retak_lebar: formSurvey.SDI_Calculation.RETAK_LEBAR,
        sdi_jumlah_lubang: formSurvey.SDI_Calculation.JUMLAH_LUBANG,
        sdi_bekas_roda: formSurvey.SDI_Calculation.BEKAS_RODA,

        //additional fields
        cek_status_entry: formSurvey.CEK_STATUS_ENTRY,
        status_jalan: formSurvey.Status_jalan,
        nilai_sdi: formSurvey.NILAI_SDI,
        data_angka: formSurvey.Data_Angka,

        //Panjang kondisi
        panjang_kondisi_baik: formSurvey.PANJANG_KONDISI.BAIK,
        panjang_kondisi_sedang: formSurvey.PANJANG_KONDISI.SEDANG,
        panjang_kondisi_rusak_ringan: formSurvey.PANJANG_KONDISI.RUSAK_RINGAN,
        panjang_kondisi_rusak_berat: formSurvey.PANJANG_KONDISI.RUSAK_BERAT,

        //Kemantapan
        kemantapan_mantap: formSurvey.KEMANTAPAN.MANTAP,
        kemantapan_tidak_mantap: formSurvey.KEMANTAPAN.TIDAK_MANTAP,

        jenis_penanganan: formSurvey.JENIS_PENANGANAN,
        iri: formSurvey.IRI
      });
    });

    // Tentukan path untuk menyimpan file
    const filePath = path.join(__dirname, '..', '..', 'downloads', `form-survey-${guid_survey}.xlsx`);

    // Membuat folder jika belum ada
    await fs.promises.mkdir(path.join(__dirname, '..', '..', 'downloads'), { recursive: true });

    // Menulis file Excel ke sistem
    await workbook.xlsx.writeFile(filePath);

    // Kirim file ke client untuk diunduh
     res.download(filePath, (err) => {
      if (err) {
        throw new HttpException('Error saat mendownload file', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting file: ${unlinkErr}`);
          }
        });
      }
    })
  }

  async create(
    createFinalReportDto: CreateFinalReportDto,
  ): Promise<FinalReport> {
    const createdFinalReport = new this.finalReportModel(createFinalReportDto);
    return await createdFinalReport.save();
  }

  async findAll(
    query: Query,
  ): Promise<{ data: ResponseFinalReport[]; page: number; totalPage: number }> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const total = await this.finalReportModel.countDocuments();

    const reports = await this.finalReportModel
      .find()
      .limit(resPerPage)
      .skip(skip)
      .exec();

    const mapRepots = reports.map((report) =>
      this.mapToResponseFinalReport(report),
    );
    const totalPages = Math.ceil(total / resPerPage);

    if (currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }

    return {
      data: mapRepots,
      page: currentPage,
      totalPage: totalPages,
    };
  }

  async allGuidRuteunik(): Promise<ResponseFinalReport[]> {
    const reports = await this.finalReportModel
      .find()
      .distinct('guid_rute')
      .exec();

    return reports.map((guid_rute) => {
      const report = new ResponseFinalReport();
      report.guid_rute = guid_rute;

      return report;
    });
  }

  async findById(id: string): Promise<ResponseFinalReport> {
    // jika ingin objectid schema jangan di isi tapi jika pake string di isi
    //jika objectId gunakan findById jika string gunakan findOne

    const report = await this.finalReportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`Data Report dengan ID ${id} tidak ditemukan`);
    }
    return this.mapToResponseFinalReport(report);
  }

  async findByRute(rute: string): Promise<ResponseFinalReport> {
    const report = await this.finalReportModel.findOne({ rute }).exec();
    if (!report) {
      throw new NotFoundException('Data Report tidak ditemukan');
    }
    return this.mapToResponseFinalReport(report);
  }

  async findKurasiByGuidRute(guid_rute): Promise<ResponseFinalReport[]> {
    const report = await this.finalReportModel.aggregate([
      {
        $match: { guid_rute }, // Filter berdasarkan guid_rute
      },
      {
        $group: {
          _id: '$guid_survey', // Mengelompokkan berdasarkan guid_survey
          id: { $first: '$_id' },
          latestDate: { $max: '$tanggal_survey' }, // Mengambil tanggal terbaru
          guid_rute: { $first: '$guid_rute' },
          surveyor: { $first: '$surveyor' },
          uploader: { $first: '$uploader' },
          tanggal_upload: { $first: '$tanggal_upload' },
          original_file_video: { $first: '$original_file_video' },
          stasion: { $first: '$station' },
          kilometer: { $first: '$kilometer' },
          rute: { $first: '$rute' },
        },
      },
      {
        $sort: { latestDate: -1 }, // Menyortir berdasarkan tanggal terbaru
      },
      {
        $project: {
          id: '$id',
          guid_rute: '$guid_rute',
          surveyor: '$surveyor',
          tanggal_survey: '$latestDate',
          uploader: '$uploader',
          tanggal_upload: '$tanggal_upload',
          original_file_video: '$original_file_video',
          station: '$stasion',
          kilometer: '$kilometer',
          rute: '$rute',
        },
      },
    ]);

    if (!report || report.length === 0) {
      throw new NotFoundException('Data Report tidak ditemukan');
    }

    return report.map((report) => {
      return {
        id: report.id.toString(),
        namafile: report.namafile,
        coordinate: report.coordinate,
        guid_survey: report._id.toString(),
        original_file_video: report.original_file_video,
        surveyor: report.surveyor,
        uploader: report.uploader,
        kamera: report.kamera,
        rute: report.rute,
        guid_rute: report.guid_rute,
        tanggal_survey: report.tanggal_survey,
        tanggal_upload: report.tanggal_upload,
        kilometer: report.kilometer,
        station: report.station,
        status_ai: report.status_ai,
        status_jalan: report.status_jalan,
        FORM_SURVEY: report.FORM_SURVEY,
        downloadable: report.downloadable,
      };
    });
  }

  async findByRouteTgl(
    tanggal_survey: string, // String yang disimpan di database
    guid_rute: string,
  ): Promise<ResponseFinalReport[]> {
    // Mengonversi tanggal_survey dari string ke objek Date
    const surveyDate = new Date(tanggal_survey);
    const startDate = startOfDay(surveyDate);
    const endDate = endOfDay(surveyDate);

    // Query ke database
    const reports = await this.finalReportModel
      .find({
        guid_rute,
        tanggal_survey: {
          $gte: startDate.toISOString(), // Mengonversi ke string untuk query
          $lte: endDate.toISOString(), // Mengonversi ke string untuk query
        },
      })
      .exec();

    // Jika tidak ada laporan yang ditemukan
    if (reports.length === 0) {
      throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return reports.map((report) => this.mapToResponseFinalReport(report));
  }

  async AllKordinate(guid_rute: string): Promise<ResponseFinalReport[]> {

    const report = await this.finalReportModel
      .find({ guid_rute }).select('id coordinate namafile rute status_jalan').exec();

    if (!report || report.length === 0) {
        throw new NotFoundException('Data Report tidak ditemukan');
      }

    return report.map((report) => this.mapToResponseFinalReport(report));
  }

  async findAllkordinate(query: Query): Promise<any[]> {
    // Pastikan bahwa kedua parameter `guid_rute` dan `tanggal_survey` diberikan
    if (!query.guid_rute || !query.tanggal_survey) {
      throw new HttpException(
        'Parameter guid_rute dan tanggal_survey harus disertakan.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ambil nilai pertama dari array jika `tanggal_survey` adalah array
    const tanggalSurvey = Array.isArray(query.tanggal_survey)
      ? query.tanggal_survey[0]
      : query.tanggal_survey;

    // Pastikan tanggal adalah string dalam format 'DD-MM-YYYY'
    if (
      typeof tanggalSurvey !== 'string' ||
      !/^\d{2}-\d{2}-\d{4}$/.test(tanggalSurvey)
    ) {
      throw new HttpException(
        'Format tanggal_survey tidak valid. Gunakan format DD-MM-YYYY.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Buat filter dengan regex untuk mencocokkan tanggal dalam format 'DD-MM-YYYY'
    const filter = {
      guid_rute: query.guid_rute,
      tanggal_survey: {
        $regex: `^${tanggalSurvey}`, // Cari yang dimulai dengan 'DD-MM-YYYY'
      },
    };

    // Cari laporan berdasarkan filter
    const reports = await this.finalReportModel
      .find(filter, 'id coordinate namafile rute status_jalan')
      .exec();

    // Jika tidak ada laporan yang ditemukan
    if (reports.length === 0) {
      throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return reports;
  }

  async findByTglSurvey(tanggal_survey: string): Promise<ResponseFinalReport> {
    // Validasi format tanggal_survey
    if (
      typeof tanggal_survey !== 'string' ||
      !/^\d{2}-\d{2}-\d{4}$/.test(tanggal_survey)
    ) {
      throw new HttpException(
        'Format tanggal_survey tidak valid. Gunakan format DD-MM-YYYY.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Buat filter dengan regex untuk mencocokkan tanggal dalam format 'DD-MM-YYYY'
    const filter = {
      tanggal_survey: {
        $regex: `^${tanggal_survey}`, // Cari yang dimulai dengan 'DD-MM-YYYY'
      },
    };

    // Cari laporan berdasarkan filter
    const report = await this.finalReportModel.findOne(filter).exec();

    // Jika tidak ada laporan yang ditemukan
    if (!report) {
      throw new NotFoundException('Data Report tidak ditemukan');
    }

    return this.mapToResponseFinalReport(report);
  }

  async findByGuidRute(guid_rute: string): Promise<ResponseFinalReport> {
    const report = await this.finalReportModel.findOne({ guid_rute }).exec();
    if (!report) {
      throw new NotFoundException('Data Report tidak ditemukan');
    }
    return this.mapToResponseFinalReport(report);
  }

  async findByGuidSurvey( guid_survey: string): Promise<ResponseFinalReport[]> {

    const report = await this.finalReportModel
      .find({ guid_survey })
      .select('id FORM_SURVEY.CEK_STATUS_ENTRY')
      .exec();
    if (!report) {
      throw new NotFoundException('Data Report tidak ditemukan');
    }

    return report.map((report) => this.mapToResponseFinalReport(report));
  }

  async findQueryByGuidSurvey( guid_survey: string, query: Query,): Promise<{data: ResponseFinalReport[]; page: number; totalPage: number}> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const total = await this.finalReportModel.countDocuments({ guid_survey });
    const reports = await this.finalReportModel
      .find({ guid_survey })
      .select('id FORM_SURVEY.CEK_STATUS_ENTRY surveyor tanggal_survey uploader tanggal_upload namafile')
      .skip(skip)
      .limit(resPerPage)
      .exec();

    const mapRepots = reports.map((report) => this.mapToResponseFinalReport(report));
    
    const totalPages = Math.ceil(total / resPerPage);

    if (currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }

    return {
      data: mapRepots,
      page: currentPage,
      totalPage: totalPages
    }

  }

  async update(
    id: string,
    updateFinalReportDto: UpdateFinalReportDto,
  ): Promise<ResponseFinalReport> {
    const updatedFinalReport = await this.finalReportModel
      .findByIdAndUpdate(id, updateFinalReportDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedFinalReport) {
      throw new NotFoundException('Data Report tidak ditemukan untuk diupdate');
    }

    return this.mapToResponseFinalReport(updatedFinalReport);
  }

  async updateFormSurvey(id: string, updateData: FormSurveyDto) {
    const data = await this.finalReportModel.findById(id);

    if (!data) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    const formSurvey = data.FORM_SURVEY;

    if (updateData.SURFACE_HARDNESS) {
      formSurvey.SURFACE_HARDNESS = {
        ...formSurvey.SURFACE_HARDNESS,
        ...updateData.SURFACE_HARDNESS,
      };
    }

    if (updateData.CRACKS) {
      formSurvey.CRACKS = { ...formSurvey.CRACKS, ...updateData.CRACKS };
    }

    if (updateData.OTHER_DAMAGE) {
      formSurvey.OTHER_DAMAGE = {
        ...formSurvey.OTHER_DAMAGE,
        ...updateData.OTHER_DAMAGE,
      };
    }

    if (updateData.SHOULDER_CHANNEL_SIDE) {
      formSurvey.SHOULDER_CHANNEL_SIDE = {
        ...formSurvey.SHOULDER_CHANNEL_SIDE,
        ...updateData.SHOULDER_CHANNEL_SIDE,
      };
    }

    if (updateData.PANJANG_KONDISI) {
      formSurvey.PANJANG_KONDISI = {
        ...formSurvey.PANJANG_KONDISI,
        ...updateData.PANJANG_KONDISI,
      };
    }

    if (updateData.KEMANTAPAN) {
      formSurvey.KEMANTAPAN = {
        ...formSurvey.KEMANTAPAN,
        ...updateData.KEMANTAPAN,
      };
    }

    if (updateData.JENIS_PENANGANAN) {
      formSurvey.JENIS_PENANGANAN = updateData.JENIS_PENANGANAN;
    }

    // Simpan perubahan
    data.FORM_SURVEY = formSurvey;
    return await data.save();
  }

  async remove(id: string): Promise<string> {
    const deletedReport = await this.finalReportModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedReport) {
      throw new NotFoundException('Data Report tidak ditemukan untuk dihapus');
    }

    return 'Data berhasil dihapus';
  }

  private mapToResponseFinalReport(report: FinalReport): ResponseFinalReport {
    return {
      id: report._id.toString(),
      namafile: report.namafile,
      coordinate: report.coordinate,
      guid_survey: report.guid_survey,
      original_file_video: report.original_file_video,
      surveyor: report.surveyor,
      uploader: report.uploader,
      kamera: report.kamera,
      rute: report.rute,
      guid_rute: report.guid_rute,
      tanggal_survey: report.tanggal_survey,
      tanggal_upload: report.tanggal_upload,
      kilometer: report.kilometer,
      station: report.station,
      status_ai: report.status_ai,
      status_jalan: report.status_jalan,
      FORM_SURVEY: report.FORM_SURVEY,
      downloadable: report.downloadable,
    };
  }
}
