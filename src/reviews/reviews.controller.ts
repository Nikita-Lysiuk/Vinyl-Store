import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { CreateReviewsDto, GetDiscogsReviewDto, GetReviewsDto } from './dto';
import { ReviewsService } from './reviews.service';
import { Review } from '@prisma/client';
import { Roles } from 'src/decorators';
import { GetDiscogsReview } from './types';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
export class ReviewsController {
    public constructor(private readonly reviewsService: ReviewsService) {}

    @Get('discogs')
    @ApiOperation({
        summary: 'Get Discogs reviews',
        description: 'Retrieve reviews from Discogs based on query parameters',
        tags: ['reviews', 'get'],
    })
    @ApiResponse({ status: 200, description: 'List of Discogs reviews' })
    public async getGiscogsReviews(
        @Query() query: GetDiscogsReviewDto
    ): Promise<GetDiscogsReview[]> {
        return await this.reviewsService.getDiscogsReviews(query);
    }

    @Get(':vinylId')
    @ApiOperation({
        summary: 'Get reviews for a vinyl',
        description: 'Retrieve reviews for a specific vinyl by its ID',
        tags: ['reviews', 'get'],
    })
    @ApiResponse({ status: 200, description: 'List of reviews for the vinyl' })
    public async getReviews(
        @Param('vinylId') vinylId: number,
        @Query() query: GetReviewsDto
    ): Promise<Review[]> {
        return await this.reviewsService.getReviews(vinylId, query);
    }

    @Post(':vinylId')
    @ApiOperation({
        summary: 'Create a review for a vinyl',
        description: 'Create a new review for a specific vinyl by its ID',
        tags: ['reviews', 'post'],
    })
    @ApiResponse({ status: 201, description: 'Review has been created' })
    public async createReviews(
        @Param('vinylId') vinylId: number,
        @Req() req,
        @Body() data: CreateReviewsDto
    ): Promise<Review> {
        const userId = req.user.sub;
        return await this.reviewsService.createReviews(vinylId, userId, data);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({
        summary: 'Delete a review',
        description: 'Delete a review by its ID',
        tags: ['reviews', 'delete'],
    })
    @ApiResponse({ status: 200, description: 'Review has been deleted' })
    public async deleteReviews(@Param('id') id: number) {
        return await this.reviewsService.deleteReviews(id);
    }
}