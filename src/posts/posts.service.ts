import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { UserPost } from './interfaces/posts.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Params } from './types';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(
        userId: string,
        createPostDto: CreatePostDto
    ): Promise<string> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', 404);
            }

            await this.postRepository.save({
                ...createPostDto,
                user,
            });

            return 'Post created successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be created' + error.message,
                500
            );
        }
    }

    async findUserPosts(
        userId: string,
        limit: number,
        offset: number,
        sort: 'ASC' | 'DESC',
        sortBy: Params,
        search: Partial<Record<Params, string>>
    ): Promise<UserPost[]> {
        try {
            const conditions = this.createSearchConditions(search);

            return await this.postRepository
                .find({
                    where: {
                        user: { id: userId },
                        ...conditions,
                    },
                    relations: ['user'],
                    order: { [sortBy]: sort },
                    take: limit,
                    skip: offset,
                })
                .then((posts: Post[]) => {
                    return posts.map((post: Post) => {
                        return {
                            title: post.title,
                            description: post.description,
                            date: post.date,
                            authorName:
                                post.user.firstName + ' ' + post.user.lastName,
                        };
                    });
                });
        } catch (error) {
            throw new HttpException(
                'User posts could not be retrieved' + error.message,
                500
            );
        }
    }

    async findAllPosts(
        limit: number,
        offset: number,
        sort: 'ASC' | 'DESC',
        sortBy: Params,
        search: Partial<Record<Params, string>>
    ): Promise<UserPost[]> {
        try {
            const conditions = this.createSearchConditions(search);

            return await this.postRepository
                .find({
                    where: conditions,
                    relations: ['user'],
                    order: { [sortBy]: sort },
                    take: limit,
                    skip: offset,
                })
                .then((posts: Post[]) => {
                    return posts.map((post: Post) => {
                        return {
                            title: post.title,
                            description: post.description,
                            date: post.date,
                            authorName:
                                post.user.firstName + ' ' + post.user.lastName,
                        };
                    });
                });
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
            const post = await this.postRepository.findOne({
                where: {
                    id,
                    user: { id: userId },
                },
            });

            if (!post) {
                throw new HttpException('Post not found', 404);
            }

            await this.postRepository.update(id, updatePostDto);
            return await this.postRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                'Post could not be updated' + error.message,
                500
            );
        }
    }

    async deletePost(id: string, userId: string): Promise<string> {
        try {
            const post = await this.postRepository.findOne({
                where: {
                    id,
                    user: { id: userId },
                },
            });

            if (!post) {
                throw new HttpException('Post not found', 404);
            }
            await this.postRepository.delete({ id });
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
            const post = await this.postRepository.findOne({
                where: { id },
                relations: ['likedBy'],
            });

            if (!post) {
                throw new HttpException('Post not found', 404);
            }

            if (post.likedBy.some((user: User) => user.id === userId)) {
                throw new ConflictException('Post already liked');
            }

            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', 404);
            }

            post.likedBy.push(user);

            await this.postRepository.save(post);
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
            const post = await this.postRepository.findOne({
                where: { id },
                relations: ['likedBy'],
            });

            if (!post) {
                throw new HttpException('Post not found', 404);
            }

            if (!post.likedBy.some((user: User) => user.id === userId)) {
                throw new ConflictException('Post not liked');
            }

            post.likedBy = post.likedBy.filter(
                (user: User) => user.id !== userId
            );

            await this.postRepository.save(post);
            return 'Post unliked successfully';
        } catch (error) {
            throw new HttpException(
                'Post could not be unliked' + error.message,
                500
            );
        }
    }

    createSearchConditions(
        search: Partial<Record<Params, string>>
    ): FindOptionsWhere<Post> {
        const searchConditions: FindOptionsWhere<Post> = {};
        if (search.id) {
            searchConditions.id = Like(`%${search.id}%`);
        }
        if (search.title) {
            searchConditions.title = Like(`%${search.title}%`);
        }
        if (search.description) {
            searchConditions.description = Like(`%${search.description}%`);
        }
        if (search.date) {
            const date = new Date(search.date);
            searchConditions.date = Equal(date);
        }
        if (search.userId) {
            searchConditions.user = { id: Like(`%${search.userId}%`) };
        }
        return searchConditions;
    }
}
