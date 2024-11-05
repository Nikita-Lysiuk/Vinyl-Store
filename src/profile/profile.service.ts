import { HttpException, Injectable } from '@nestjs/common';
import { GetProfile, UpdateProfile } from './types';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateProfileDto } from './dto';
import { S3Service } from 'src/common';
import { User } from '@prisma/client';

@Injectable()
export class ProfileService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly s3Service: S3Service
    ) {}

    async getProfile(userId: number): Promise<GetProfile> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                firstName: true,
                lastName: true,
                birthDate: true,
                email: true,
                avatar: true,
                reviews: {
                    select: {
                        vinylId: true,
                        score: true,
                        comment: true,
                    },
                },
                purchases: {
                    where: {
                        status: 'APPROVED',
                    },
                    select: {
                        items: {
                            select: {
                                vinyl: {
                                    select: {
                                        name: true,
                                        authorName: true,
                                        price: true,
                                    },
                                },
                                quantity: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async updateProfile(
        userId: number,
        updateProfileDto: UpdateProfileDto,
        avatar?: Express.Multer.File
    ): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new HttpException('User not found', 404);
        }

        const data: UpdateProfile = {
            firstName: updateProfileDto.firstName ?? user.firstName,
            lastName: updateProfileDto.lastName ?? user.lastName,
            birthDate: updateProfileDto.birthDate
                ? new Date(updateProfileDto.birthDate)
                : user.birthDate,
            avatar: user.avatar,
        };

        if (avatar) {
            await this.s3Service.deleteFile(user.avatar);
            const avatarUrl = await this.s3Service.uploadFile(avatar);
            data.avatar = avatarUrl;
        }

        const updatedProfile = await this.prismaService.user.update({
            where: { id: userId },
            data,
        });

        if (!updatedProfile) {
            await this.s3Service.deleteFile(data.avatar);
            throw new HttpException('Error updating profile', 500);
        }

        return updatedProfile;
    }

    async deleteProfile(userId: number) {
        await this.prismaService.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
