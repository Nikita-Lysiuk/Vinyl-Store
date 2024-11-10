import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReviewsDto, GetDiscogsReviewDto, GetReviewsDto } from './dto';
import { Review } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { GetDiscogsReview } from './types';
import axios from 'axios';

@Injectable()
export class ReviewsService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) {}

    async getDiscogsReviews(query: GetDiscogsReviewDto): Promise<GetDiscogsReview[]> {
        const { limit, offset, vinylId } = query;
        const discogsUrl = this.configService.get('DISCOGS_API_URL');
        const discogsToken = this.configService.get('DISCOGS_TOKEN');

        const vinyls = await this.prismaService.vinyl.findMany({
            take: limit,
            skip: offset,
            where: vinylId ? { id: vinylId } : {},
            select: { id: true }
        });

        const reviews: GetDiscogsReview[] = await Promise.all(
            vinyls.map(async (vinyl) => {
                try {
                    const rating = await axios.get(`${discogsUrl}/releases/${vinyl.id}/rating`, {
                        headers: {
                            Authorization: `Discogs token=${discogsToken}`,
                        }
                    }).then((response) => response.data.rating);    

                    return {
                        vinylId: vinyl.id,
                        count: rating.count,
                        score: rating.average,
                    };
                }
                catch (error) {
                    if (error.response && error.response.status === 404) {
                        return {
                            vinylId: vinyl.id,
                            count: 0,
                            score: 0,
                            error: 'Not the part of the Discogs database',
                        };
                    }
                    else {
                        throw new HttpException('Something went wrong', 500);
                    }
                }
            })
        );

        return reviews;
    }

    async getReviews(vinylId: number, query: GetReviewsDto): Promise<Review[]> {
        const { limit, offset } = query;

        const vinyl = await this.prismaService.vinyl.findUnique({
            where: { id: vinylId },
        });

        if (!vinyl) {
            throw new HttpException('Vinyl not found', 404);
        }

        return await this.prismaService.review.findMany({
            take: limit,
            skip: offset,
            where: { vinylId },
        });
    }

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
}