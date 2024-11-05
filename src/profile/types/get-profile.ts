export type Review = {
    vinylId: number;
    score: number;
    comment: string;
}

export type Vinyl = {
    name: string;
    authorName: string;
    price: number;
}

export type Item = {
    vinyl: Vinyl;
    quantity: number;
}

export type Purchase = {
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