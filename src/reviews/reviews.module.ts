import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    providers: [
        PrismaService,
        ReviewsService,
    ],
    controllers: [ReviewsController],
})
export class ReviewsModule {}