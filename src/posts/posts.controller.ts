import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('post')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        const userId = req.user.userId;
        return await this.postsService.create(userId, createPostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findUserPosts(@Request() req) {
        const userId = req.user.userId;
        return await this.postsService.findUserPosts(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    async findAllPosts(@Request() req) {
        const userId = req.user.userId;
        return await this.postsService.findAllPosts(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updatePost(
        @Body() updatePostDto: UpdatePostDto,
        @Param('id') id: string
    ) {
        return await this.postsService.updatePost(id, updatePostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return await this.postsService.deletePost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    async likePost(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return await this.postsService.likePost(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/unlike')
    async unlikePost(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return await this.postsService.unlikePost(id, userId);
    }
}
