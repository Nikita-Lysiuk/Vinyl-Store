import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { Public, Roles } from 'src/decorators';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { VinylsService } from './vinyls.service';
import { GetSearchVinyls, GetVinyls } from './types';
import {
    CreateVinylRecordDto,
    GetSearchVinylsDto,
    GetVinylsDto,
    UpdateVinylRecordDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Vinyl } from '@prisma/client';

@Controller('vinyls')
@UseFilters(HttpExceptionFilter)
export class VinylsController {
    public constructor(private readonly vinylsService: VinylsService) {}

    @Get()
    @Public()
    public async getVinyls(@Query() query: GetVinylsDto): Promise<GetVinyls[]> {
        return await this.vinylsService.getVinyls(query);
    }

    @Get('search')
    public async searchVinyls(
        @Query() query: GetSearchVinylsDto
    ): Promise<GetSearchVinyls[]> {
        return await this.vinylsService.searchVinyls(query);
    }

    @Post()
    @Roles('ADMIN')
    @UseInterceptors(
        FileInterceptor('coverImage', {
            storage: multer.memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter: (_, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new BadRequestException('must be an image file'),
                        false
                    );
                }
                callback(null, true);
            },
        })
    )
    public async createVinyl(
        @Body() createVinylRecordDto: CreateVinylRecordDto,
        @UploadedFile() coverImage: Express.Multer.File
    ): Promise<string> {
        return await this.vinylsService.createVinyl(
            createVinylRecordDto,
            coverImage
        );
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseInterceptors(
        FileInterceptor('coverImage', {
            storage: multer.memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter: (_, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new BadRequestException('must be an image file'),
                        false
                    );
                }
                callback(null, true);
            },
        })
    )
    public async updateVinyl(
        @Param('id') id: string,
        @Body() updateVinylRecordDto: UpdateVinylRecordDto,
        @UploadedFile() coverImage?: Express.Multer.File
    ): Promise<Vinyl> {
        return await this.vinylsService.updateVinyl(
            id,
            updateVinylRecordDto,
            coverImage
        );
    }

    @Delete(':id')
    @Roles('ADMIN')
    public async deleteVinyl(@Param('id') id: string): Promise<string> {
        return await this.vinylsService.deleteVinyl(id);
    }
}
