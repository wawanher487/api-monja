import { FtpService } from './ftv.service';
import { Response } from 'express';
import { Controller, Get, Res, HttpStatus, Param, HttpException } from '@nestjs/common';

@Controller('ftv')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  @Get()
  async fetchData() {
    try {
      // Fetch data from FTP
      const data = await this.ftpService.fetchData();
      return {
        success: true,
        message: 'Data fetched successfully',
        data,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new HttpException('Error fetching data from FTP server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/download/image/:fileName')
  async getDownloadImage(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      // Download the image from FTP
      const imageBuffer = await this.ftpService.downloadImage(fileName);

      // Set the correct content type based on the file extension
      const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      res.setHeader('Content-Type', contentType);

      // Send the image buffer as the response
      res.send(imageBuffer);
    } catch (error) {
      console.error(`Error fetching image ${fileName}:`, error);
      if (!res.headersSent) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Image ${fileName} not found`,
        });
      }
    }
  }

  @Get('image/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      // Streaming gambar dari FTP
      const imageStream = await this.ftpService.streamImage(fileName);

      // Tentukan Content-Type berdasarkan ekstensi file
      let contentType = 'application/octet-stream'; // Default
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        contentType = 'image/jpeg';
      } else if (fileName.endsWith('.png')) {
        contentType = 'image/png';
      }
      
      // Set header Content-Type
      res.setHeader('Content-Type', contentType);

      // Pipe stream gambar ke response
      imageStream.pipe(res);

      // Menangani error pada stream
      imageStream.on('error', error => {
        console.error(`Error streaming image ${fileName}:`, error);
        if (!res.headersSent) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `Error streaming image ${fileName}`,
          });
        }
      });
      
    } catch (error) {
      console.error(`Error fetching image ${fileName}:`, error);
      if (!res.headersSent) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Image ${fileName} not found`,
        });
      }
    }
  }
}
