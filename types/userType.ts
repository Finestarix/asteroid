export interface User {
    id: number,
    fullname: string,
    username: string,
    password: string,
    role: UserRole,
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface LoginParameter {
    username: string,
    password: string
}

export interface LoginData {
    role: string,
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
    CateringAdmin = "CateringAdmin",
    DebtAdmin = "DebtAdmin",
    Owner = "Owner"
}

export enum UserStatus {
    Requested = "Requested",
    Accepted = "Accepted",
    Blocked = "Blocked"
}
