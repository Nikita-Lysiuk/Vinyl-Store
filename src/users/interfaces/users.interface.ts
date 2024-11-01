export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetProfileData {
    firstName: string;
    lastName: string;
    email: string;
}
