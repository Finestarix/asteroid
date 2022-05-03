import {Avatar} from "types/avatarType";


export interface User {
    id: number,
    fullname: string,
    username: string,
    password: string,
    role: UserRole,
    avatar: Avatar
}

export interface LoginParameter {
    username: string,
    password: string
}

export interface LoginData {
    token: string,
    error: string
}

export interface RegisterParameter {
    username: string,
    password: string,
    confirmPassword: string
}

export interface RegisterData {
    error: string
}

export interface TokenData {
    username: string,
    role: UserRole
}

export enum UserRole {
    User = "User",
    Admin = "Admin",
    Owner = "Owner"
}
