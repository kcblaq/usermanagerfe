export interface User {
    name: string;
    email: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResponseData {
    data: User[];
    total: number;
    page: number;
    limit: number;
}