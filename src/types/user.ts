export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type RegisterRequestBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type LoginRequestBody = {
    email: string;
    password: string;
}

export type UpdateUserRequestBody = {
    firstName: string;
    lastName: string;
}

export type UserResponse = {
    firstName: string;
    lastName: string;
    email: string;
}