export interface User {
    name: string;
    email: string;
    _id?: string;
    role?: "user" | "admin" | undefined;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ResponseData {
    data: User[];
    total: number;
    page: number;
    limit: number;
}