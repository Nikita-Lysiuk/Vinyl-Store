import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, QueryParamsDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { plainToClass } from 'class-transformer';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        const userId = req.user.userId;
        return await this.postsService.create(userId, createPostDto);
    }

    @Get()
    async findUserPosts(@Request() req, @Query() query: QueryParamsDto) {
        const userId = req.user.userId;
        const queryParams = plainToClass(QueryParamsDto, query);
        return await this.postsService.findUserPosts(userId, queryParams);
    }

    @Get('all')
    async findAllPosts(@Query() query: QueryParamsDto) {
        const queryParams = plainToClass(QueryParamsDto, query);
        return await this.postsService.findAllPosts(queryParams);
    }

    @Put(':id')
    async updatePost(
        @Request() req,
        @Body() updatePostDto: UpdatePostDto,
        @Param('id') id: string
    ) {
        const userId = req.user.userId;
        return await this.postsService.updatePost(id, updatePostDto, userId);
    }

    @Delete(':id')
    async deletePost(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return await this.postsService.deletePost(id, userId);
    }

    @Post(':id/like')
    async likePost(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return await this.postsService.likePost(id, userId);
    }

    @Post(':id/unlike')
    async unlikePost(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return await this.postsService.unlikePost(id, userId);
    }
}
