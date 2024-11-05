import {
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
import { UpdateProfileDto } from './dto';
import { imageFileInterceptor } from 'src/common';
import { User } from '@prisma/client';

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
    @UseInterceptors(imageFileInterceptor('avatar'))
    public async updateProfile(
        @Req() req,
        @Body() UpdateProfileDto: UpdateProfileDto,
        @UploadedFile() avatar?: Express.Multer.File
    ): Promise<User> {
        const userId = req.user.sub;
        return await this.profileService.updateProfile(
            userId,
            UpdateProfileDto,
            avatar
        );
    }

    @Delete()
    public async deleteProfile(@Req() req) {
        const userId = req.user.sub;
        return await this.profileService.deleteProfile(userId);
    }
}
