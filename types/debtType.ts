import {User} from "types/userType";


export interface DebtHeader {
    id: number,
    lender: User,
    lenderId: number
    title: string
    lendingTime: Date,
    details: DebtDetail[],
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface DebtDetail {
    id: number,
    header: DebtHeader,
    headerId: number,
    borrower: User,
    borrowerId: number,
    amount: number,
    payTime: Date,
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface InsertDebtHeaderParameter {
    lenderId: number,
    title: string
    lendingTime: Date,
    details: InsertDebtDetailParameter[]
}

export interface InsertDebtDetailParameter {
    borrowerId: number,
    amount: number
}
