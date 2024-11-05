import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { CreateReviewsDto, GetReviewsDto } from './dto';
import { ReviewsService } from './reviews.service';
import { Review } from '@prisma/client';
import { Roles } from 'src/decorators';

@Controller('reviews')
@UseFilters(HttpExceptionFilter)
export class ReviewsController {
    public constructor(private readonly reviewsService: ReviewsService) {}

    @Post(':vinylId')
    public async createReviews(
        @Param('vinylId') vinylId: number,
        @Req() req,
        @Body() data: CreateReviewsDto
    ): Promise<Review>
    {
        const userId = req.user.sub;
        return await this.reviewsService.createReviews(vinylId, userId, data);
    }

    @Delete(':id')
    @Roles('ADMIN')
    public async deleteReviews(@Param('id') id: number) {
        return await this.reviewsService.deleteReviews(id);
    }

    @Get(':vinylId')
    public async getReviews(
        @Param('vinylId') vinylId: number,
        @Query() query: GetReviewsDto
    ): Promise<Review[]> {
        return await this.reviewsService.getReviews(vinylId, query);
    }
}