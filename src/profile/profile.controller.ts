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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
export class ProfileController {
    public constructor(private readonly profileService: ProfileService) {}

    @Get()
    @ApiOperation({
        summary: 'Get user profile',
        description: 'Retrieve the profile of the authenticated user',
        tags: ['profile', 'get'],
    })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    public async getProfile(@Req() req): Promise<GetProfile> {
        const userId = req.user.sub;
        return await this.profileService.getProfile(userId);
    }

    @Put()
    @UseInterceptors(imageFileInterceptor('avatar'))
    @ApiOperation({
        summary: 'Update user profile',
        description: 'Update the profile of the authenticated user',
        tags: ['profile', 'put'],
    })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Data to update user profile',
        type: UpdateProfileDto,
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
    @ApiOperation({
        summary: 'Delete user profile',
        description: 'Delete the profile of the authenticated user',
        tags: ['profile', 'delete'],
    })
    @ApiResponse({ status: 200, description: 'User profile deleted successfully' })
    public async deleteProfile(@Req() req) {
        const userId = req.user.sub;
        return await this.profileService.deleteProfile(userId);
    }
}