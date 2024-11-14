import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as FTP from 'basic-ftp';
import { Client } from 'basic-ftp';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PassThrough } from 'stream';

@Injectable()
export class FtpService {
  private readonly ftpClient = new FTP.Client();

  async fetchData() {
    const client = new Client();
    try {
      // Connect to the FTP server with the provided credentials
      await client.access({
        host: 'ftp5.pptik.id',
        port: 2121,
        user: 'monitoring',
        password: 'Tpm0ni23!n6',
        secure: false, // Set to true if FTP requires SSL
      });

      // Navigate to the target folder
      await client.cd('/road_coba/gambar'); // Change directory to the target folder

      // List the files in the target folder
      const data = await client.list();

      if (data.length === 0) {
        throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new HttpException(
        'Error fetching data from FTP server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.close();
    }
  }

  async downloadImage(fileName: string): Promise<Buffer> {
    const client = new Client();
    const filePath = path.join(os.tmpdir(), fileName);
    try {
      // Connect to the FTP server
      await client.access({
        host: 'ftp5.pptik.id',
        port: 2121,
        user: 'monitoring',
        password: 'Tpm0ni23!n6',
        secure: false,
      });

      // Navigate to the directory where the images are stored
      await client.cd('/road_coba/gambar');

      // Download the image as a buffer
      const writableStream = fs.createWriteStream(filePath);
      await client.downloadTo(writableStream, fileName);

      // Read the file into a buffer
      const fileBuffer = fs.readFileSync(filePath);

      return fileBuffer;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new HttpException(
        'Error downloading image from FTP server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.close();
    }
  }

  async streamImage(fileName: string): Promise<PassThrough> {
    const client = new Client();
    const passThrough = new PassThrough();
    try {
      // Connect to the FTP server
      await client.access({
        host: 'ftp5.pptik.id',
        port: 2121,
        user: 'monitoring',
        password: 'Tpm0ni23!n6',
        secure: false,
      });

      // Navigate to the directory where the images are stored
      await client.cd('/road_coba/gambar');

      // Streaming file from FTP to PassThrough stream
      client
        .downloadTo(passThrough, fileName)
        .then(() => {
          client.close(); // Close connection after successful download
        })
        .catch((error) => {
          passThrough.destroy(error);
          client.close(); // Ensure connection is closed if an error occurs
        });
      return passThrough;
    } catch (error) {
      console.error('Error streaming image:', error);
      client.close(); // Ensure connection is closed if an error occurs
      throw new HttpException(
        'Error streaming image from FTP server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
