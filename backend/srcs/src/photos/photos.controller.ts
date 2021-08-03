import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import { imageFileFilter } from './image.file-filter';

@Controller('photos')
export default class PhotosController {
  constructor() {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      dest: './uploads',
      fileFilter: imageFileFilter,
    }),
  )
  uploadSingle(@UploadedFile() file: any) {
    return file;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image: any, @Res() res: any) {
    return res.sendFile(image, { root: './uploads' });
  }

  @Delete(':imgpath')
  deleteUploadedFile(@Param('imgpath') image: any) {
    fs.unlinkSync('./uploads/' + image);
  }
}
