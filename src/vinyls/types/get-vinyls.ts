export type GetVinyls = {
    id: number;
    name: string;
    authorName: string;
    description: string;
    price: number;
    firstReview?: string;
    averageScore?: number;
}