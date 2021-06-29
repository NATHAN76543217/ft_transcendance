import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, PhotosService } from './photos.service';
import * as fs from 'fs';

@Controller('photos')
export default class PhotosController {
    constructor(
        private readonly photosService: PhotosService) { }

    @Post("upload")
    @UseInterceptors(
        FileInterceptor("photo", {
            dest: "./uploads",
            fileFilter: imageFileFilter,
        })
    )
    uploadSingle(@UploadedFile() file: any) {
        console.log(file);
        return file;
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image: any, @Res() res: any) {
        return res.sendFile(image, { root: './uploads' });
    }

    @Delete(':imgpath')
    deleteUploadedFile(@Param('imgpath') image: any) {
        fs.unlinkSync('./uploads/' + image)
    }
}
