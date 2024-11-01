export interface Post {
    id: string;
    title: string;
    description: string;
    date: number;
    userId: string;
    likedBy: string[];
}

export interface UserPost {
    title: string;
    description: string;
    date: number;
    authorName: string;
}
