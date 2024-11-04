import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Put,
    Req,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { GetProfile } from './types';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto';
import * as multer from 'multer';

@Controller('profile')
@UseFilters(HttpExceptionFilter)
export class ProfileController {
    public constructor(private readonly profileService: ProfileService) {}

    @Get()
    public async getProfile(@Req() req): Promise<GetProfile> {
        const userId = req.user.sub;
        return await this.profileService.getProfile(userId);
    }

    @Put()
    @UseInterceptors(
        FileInterceptor('avatar', {
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
    public async updateProfile(
        @Req() req,
        @Body() UpdateProfileDto: UpdateProfileDto,
        @UploadedFile() avatar?: Express.Multer.File
    ): Promise<string> {
        const userId = req.user.sub;
        return await this.profileService.updateProfile(
            userId,
            UpdateProfileDto,
            avatar
        );
    }

    @Delete()
    public async deleteProfile(@Req() req): Promise<string> {
        const userId = req.user.sub;
        return await this.profileService.deleteProfile(userId);
    }
}
