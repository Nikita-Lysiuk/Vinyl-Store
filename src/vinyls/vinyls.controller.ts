import {
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
import { Vinyl } from '@prisma/client';
import { imageFileInterceptor } from 'src/common';

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
    @UseInterceptors(imageFileInterceptor('coverImage'))
    public async createVinyl(
        @Body() createVinylRecordDto: CreateVinylRecordDto,
        @UploadedFile() coverImage: Express.Multer.File
    ): Promise<Vinyl> {
        return await this.vinylsService.createVinyl(
            createVinylRecordDto,
            coverImage
        );
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseInterceptors(imageFileInterceptor('coverImage'))
    public async updateVinyl(
        @Param('id') id: number,
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
    public async deleteVinyl(@Param('id') id: number) {
        return await this.vinylsService.deleteVinyl(id);
    }
}
