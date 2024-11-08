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
    CreateVinylRecordFromDiscogsDto,
    GetSearchVinylsDto,
    GetVinylsDto,
    UpdateVinylRecordDto,
} from './dto';
import { Vinyl } from '@prisma/client';
import { imageFileInterceptor } from 'src/common';
import { TelegramInterceptor } from 'src/interceptors/telegram.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Vinyls')
@Controller('vinyls')
@UseFilters(HttpExceptionFilter)
export class VinylsController {
    public constructor(private readonly vinylsService: VinylsService) {}

    @Get()
    @Public()
    @ApiOperation({ 
        summary: 'Get vinyl list',
        description: 'Get list of vinyls with pagination for better navigation',
        tags: ['vinyls', 'get'],
    })
    @ApiResponse({ status: 200, description: 'List of vinyls with average score and first review' })
    public async getVinyls(@Query() query: GetVinylsDto): Promise<GetVinyls[]> {
        return await this.vinylsService.getVinyls(query);
    }

    @Get('search')
    @ApiOperation({
        summary: 'Search vinyls',
        description: 'Search vinyls by name or artist name with sorting by name, artist name and price and pagination. Available only for authenticated users',
        tags: ['vinyls', 'get'],
    })
    @ApiResponse({ status: 200, description: 'List of vinyls' })
    @ApiBearerAuth()
    public async searchVinyls(
        @Query() query: GetSearchVinylsDto
    ): Promise<GetSearchVinyls[]> {
        return await this.vinylsService.searchVinyls(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get vinyl',
        description: 'Get vinyl by id',
        tags: ['vinyls', 'get'],
    })
    @ApiResponse({ status: 200, description: 'Vinyl' })
    @ApiBearerAuth()
    public async getVinyl(@Param('id') id: number): Promise<Vinyl> {
        return await this.vinylsService.getVinyl(id);
    }

    @Post()
    @Roles('ADMIN')
    @UseInterceptors(
        imageFileInterceptor('coverImage'),
        TelegramInterceptor
    )
    @ApiOperation({
        summary: 'Create vinyl',
        description: 'Add new vinyl to the database',
        tags: ['vinyls', 'post'],
    })
    @ApiResponse({ status: 201, description: 'New vinyl has been created' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        description: 'Vinyl record',
        type: CreateVinylRecordDto,
    })
    @ApiBody({
        description: 'Avatar image file',
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    public async createVinyl(
        @Body() createVinylRecordDto: CreateVinylRecordDto,
        @UploadedFile() coverImage: Express.Multer.File
    ): Promise<Vinyl> {
        return await this.vinylsService.createVinyl(
            createVinylRecordDto,
            coverImage
        );
    }

    @Post('discogs')
    @Roles('ADMIN')
    @UseInterceptors(TelegramInterceptor)
    @ApiOperation({
        summary: 'Create vinyl from Discogs',
        description: 'Add new vinyl to the database from Discogs',
        tags: ['vinyls', 'post'],
    })
    @ApiResponse({ status: 201, description: 'New vinyl has been created' })
    @ApiBearerAuth()
    public async createVinylFromDiscogs(
        @Query() query: CreateVinylRecordFromDiscogsDto,
    ): Promise<Vinyl[]> {
        return await this.vinylsService.createVinylFromDiscogs(query);
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseInterceptors(imageFileInterceptor('coverImage'))
    @ApiOperation({
        summary: 'Update vinyl',
        description: 'Update vinyl by id',
        tags: ['vinyls', 'put'],
    })
    @ApiResponse({ status: 200, description: 'Vinyl has been updated' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
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
    @ApiOperation({
        summary: 'Delete vinyl',
        description: 'Delete vinyl by id',
        tags: ['vinyls', 'delete'],
    })
    @ApiResponse({ status: 200, description: 'Vinyl has been deleted' })
    @ApiBearerAuth()
    public async deleteVinyl(@Param('id') id: number) {
        return await this.vinylsService.deleteVinyl(id);
    }
}
