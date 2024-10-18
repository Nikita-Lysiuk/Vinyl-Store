export interface GetProfileData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserWithPost {
    firtName: string;
    lastName: string;
    email: string;
    title: string | null;
    description: string | null;
    date: Date | null;
    likesCount: number | null;
}
