import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followingCount: number;
    followersCount: number;
    following: boolean;
    photos?: Photo[];
}

export interface UserActivity {
    id: string;
    title: string;
    category: string;
    date: Date;
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}