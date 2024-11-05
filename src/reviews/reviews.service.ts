import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReviewsDto, GetReviewsDto } from './dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
    public constructor(private readonly prismaService: PrismaService) {}

    async createReviews(vinylId: number, userId: number, data: CreateReviewsDto): Promise<Review> {
        const review = await this.prismaService.review.create({
            data: {
                ...data,
                vinyl: {
                    connect: {
                        id: vinylId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        if (!review) {
            throw new HttpException('Review not created', 500);
        }

        return review;
    }

    async deleteReviews(id: number) {
        const review = await this.prismaService.review.findUnique({
            where: { id },
        });

        if (!review) {
            throw new HttpException('Review not found', 404);
        }

        await this.prismaService.review.delete({
            where: { id },
        });
    }

    async getReviews(vinylId: number, query: GetReviewsDto): Promise<Review[]> {
        const { limit, offset } = query;

        return await this.prismaService.review.findMany({
            take: limit,
            skip: offset,
            where: { vinylId },
        });
    }
}