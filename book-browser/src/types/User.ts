// src/types/User.ts
export interface User {
    id: string;           // your own user ID
    name: string;
    email: string;
    avatarUrl?: string;   // optional profile picture URL
    favorites?: string[]; // array of Book.id values
}