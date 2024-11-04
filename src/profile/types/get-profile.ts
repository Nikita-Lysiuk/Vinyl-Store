export type Review = {
    vinylId: number;
    score: number;
    comment: string;
}

export type Vinyl = {
    name: string;
    authorName: string;
}

export type Item = {
    vinyl: Vinyl;
}

export type Purchase = {
    totalPrice: number;
    items: Item[];
}

export type GetProfile = {
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    avatar: string;
    reviews: Review[];
    purchases: Purchase[];
}