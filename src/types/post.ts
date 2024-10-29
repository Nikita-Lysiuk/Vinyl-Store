export type Post = {
    id: string;
    title: string;
    description: string;
    date: string;
    userId: string;
}

export type CreatePostRequestBody = {
    title: string;
    description: string;
}

export type UpdatePostRequestBody = {
    title: string;
    description: string;
}

export type PostResponse = {
    title: string;
    description: string;
    date: string;
    authorName: string;
}
