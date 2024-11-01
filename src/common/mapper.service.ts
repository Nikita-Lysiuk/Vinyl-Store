import { Injectable } from '@nestjs/common';
import { Post, UserPost } from 'src/posts/interfaces/posts.interface';
import { User } from 'src/users/interfaces/users.interface';

@Injectable()
export class MapperService {
    public static mapPostToUserPost(post: Post, user: User): UserPost {
        return {
            title: post.title,
            description: post.description,
            date: post.date,
            authorName: `${user.firstName} ${user.lastName}`,
        };
    }

    public static mapPostsToUserPosts(
        posts: Post[],
        users: User[],
        userId?: string,
        sortByDate?: boolean
    ): UserPost[] {
        let filteredPosts = posts;

        if (userId) {
            filteredPosts = posts.filter(
                (post: Post) => post.userId === userId
            );
        }

        if (sortByDate) {
            filteredPosts = filteredPosts.sort(
                (a: Post, b: Post) => b.date - a.date
            );
        }

        return filteredPosts.map((post: Post) => {
            const user = users.find((user: User) => user.id === post.userId);
            if (!user) throw new Error(`User with id ${post.userId} not found`);

            return MapperService.mapPostToUserPost(post, user);
        });
    }
}
