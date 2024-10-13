export interface Post {
    id: string;
    title: string;
    description: string;
    date: string;
    userId: string;
    likedBy: string[];
}

export interface UserPost {
    title: string;
    description: string;
    date: string;
    authorName: string;
}
