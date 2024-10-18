import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService, MapperService } from 'src/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post, UserPost } from './interfaces/posts.interface';
import { User } from 'src/users/interfaces/users.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private users: User[] = [];
    private readonly POST_PATH: string;
    private readonly USER_PATH: string;

    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService
    ) {
        this.POST_PATH = this.configService.get<string>('POST_DATA_PATH') || '';
        this.USER_PATH = this.configService.get<string>('USER_DATA_PATH') || '';
    }

    async create(
        userId: string,
        createPostDto: CreatePostDto
    ): Promise<string> {
        const post: Post = {
            id: uuidv4(),
            ...createPostDto,
            date: new Date().getTime(),
            userId,
            likedBy: [],
        };

        try {
            this.posts = await this.filesService.readDataFromFile<Post>(
                this.POST_PATH
            );
            this.posts.push(post);
            await this.filesService.writeDataToFile(this.POST_PATH, this.posts);
            return 'Post created successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be created' + error.message,
                500
            );
        }
    }

    async findUserPosts(userId: string): Promise<UserPost[]> {
        try {
            this.posts = await this.filesService.readDataFromFile<Post>(
                this.POST_PATH
            );
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );
            return MapperService.mapPostsToUserPosts(
                this.posts,
                this.users,
                userId,
                false
            );
        } catch (error) {
            throw new HttpException(
                'User posts could not be retrieved' + error.message,
                500
            );
        }
    }

    async findAllPosts(): Promise<UserPost[]> {
        try {
            this.posts = await this.filesService.readDataFromFile<Post>(
                this.POST_PATH
            );
            this.users = await this.filesService.readDataFromFile<User>(
                this.USER_PATH
            );

            return MapperService.mapPostsToUserPosts(
                this.posts,
                this.users,
                undefined,
                true
            );
        } catch (error) {
            throw new HttpException(
                'All posts could not be retrieved' + error.message,
                500
            );
        }
    }

    async updatePost(
        id: string,
        updatePostDto: UpdatePostDto,
        userId: string
    ): Promise<Post> {
        try {
            const postIndex = await this.getPostById(id);
            if (this.posts[postIndex].userId !== userId) {
                throw new HttpException(
                    'You dont have permission to update this post',
                    403
                );
            }

            this.posts[postIndex] = {
                ...this.posts[postIndex],
                ...updatePostDto,
            };

            await this.filesService.writeDataToFile(this.POST_PATH, this.posts);
            return this.posts[postIndex];
        } catch (error) {
            throw new HttpException(
                'Post could not be updated' + error.message,
                500
            );
        }
    }

    async deletePost(id: string, userId: string): Promise<string> {
        try {
            const postIndex = await this.getPostById(id);
            if (this.posts[postIndex].userId !== userId) {
                throw new HttpException(
                    'You dont have permission to delete this post',
                    403
                );
            }
            this.posts.splice(postIndex, 1);

            await this.filesService.writeDataToFile(this.POST_PATH, this.posts);
            return 'Post deleted successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be deleted' + error.message,
                500
            );
        }
    }

    async likePost(id: string, userId: string): Promise<string> {
        try {
            const postIndex = await this.getPostById(id);

            if (this.posts[postIndex].likedBy.includes(userId)) {
                throw new HttpException('Post already liked', 400);
            }

            this.posts[postIndex].likedBy.push(userId);

            await this.filesService.writeDataToFile(this.POST_PATH, this.posts);
            return 'Post liked successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be liked' + error.message,
                500
            );
        }
    }

    async unlikePost(id: string, userId: string): Promise<string> {
        try {
            const postIndex = await this.getPostById(id);

            if (!this.posts[postIndex].likedBy.includes(userId)) {
                throw new HttpException('Post not liked', 400);
            }

            this.posts[postIndex].likedBy = this.posts[
                postIndex
            ].likedBy.filter((id: string) => id !== userId);

            await this.filesService.writeDataToFile(this.POST_PATH, this.posts);
            return 'Post unliked successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be unliked' + error.message,
                500
            );
        }
    }

    private async getPostById(id: string): Promise<number> {
        this.posts = await this.filesService.readDataFromFile<Post>(
            this.POST_PATH
        );
        const postIndex = this.posts.findIndex((post: Post) => post.id === id);
        if (postIndex === -1) {
            throw new HttpException('Post not found', 404);
        }

        return postIndex;
    }
}
