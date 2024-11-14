import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FtpController } from './ftv.controller';
import { FtpService } from './ftv.service';



@Module({
  imports: [HttpModule],
  controllers: [FtpController],
  providers: [FtpService],
})
export class FtvModule {}
