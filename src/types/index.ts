type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type Post = {
    id: string;
    title: string;
    description: string;
    date: string;
    userId: string;
}

type RegisterRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type { User, Post, RegisterRequestBody };