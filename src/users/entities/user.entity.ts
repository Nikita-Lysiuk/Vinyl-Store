import { Post } from 'src/posts/entities/post.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ length: 100 })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @ManyToMany(() => Post, (post) => post.likedBy)
    @JoinTable({
        name: 'likes',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'postId', referencedColumnName: 'id' },
    })
    likedPosts: Post[];
}
