export interface User {
    id: number,
    alias: string,
    username: string,
    password: string,
    role: UserRole,
    status: UserStatus,
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

export interface ViewUserData {
    data: User,
    error: string
}

export interface ViewUsersData {
    data: User[],
    error: string
}

export interface UpdatePasswordUserParameter {
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
}

export interface UpdateUsernameUserParameter {
    username: string
}

export interface UpdateAliasUserParameter {
    id: number,
    alias: string
}

export interface UpdateRoleUserParameter {
    id: number,
    role: UserRole
}

export interface UpdateStatusUserParameter {
    id: number,
    status: UserStatus
}

export interface UpdateDeleteUserParameter {
    id: number
}

export interface UpdateDeleteUserData {
    data: User,
    error: string,
    success: string
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
