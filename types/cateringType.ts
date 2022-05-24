import {User} from "types/userType";


export interface CateringTransaction {
    id: number,
    date: Date,
    basePrice: number,
    deliveryPrice: number,
    realDeliveryPrice: number,
    active: boolean,
    createdBy: User,
    createdById: number,
    lastUpdatedBy: User,
    lastUpdatedById: number,
    details: CateringTransactionDetail[],
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface CateringTransactionDetail {
    id: number,
    header: CateringTransaction,
    headerId: number,
    participant: User,
    participantId: number,
    paymentType: CateringPaymentType,
    note: string,
    onlyAdditional: boolean,
    payTime: Date,
    approveTime: Date,
    foods: CateringTransactionParticipant[],
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean,
    subTotal: number,
    total: number
}

export interface CateringTransactionParticipant {
    id: number,
    detail: CateringTransactionDetail,
    detailId: number,
    food: CateringFood,
    foodId: number,
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface CateringFood {
    id: number,
    name: string,
    category: CateringFoodCategory,
    additionalPrice: number,
    reductionPrice: number,
    active: boolean,
    createdBy: User,
    createdById: number,
    lastUpdatedBy: User,
    lastUpdatedById: number,
    createdAt: Date,
    deletedAt: Date,
    deleted: boolean
}

export interface ViewActiveCateringTransactionData {
    data: CateringTransaction,
    error: string
}

export interface ViewCateringTransactionData {
    data: CateringTransaction[],
    error: string
}

export interface ViewTotalCateringTransactionParameter {
    id: number
}

export interface ViewTotalCateringTransactionData {
    data: number,
    error: string,
    success: string
}

export interface InsertCateringTransactionParameter {
    date: Date,
    basePrice: number,
}

export interface UpdateDeleteCateringTransactionParameter {
    id: number
}

export interface UpdateDeliveryCateringTransactionParameter {
    id: number,
    deliveryPrice: number
}

export interface ChangeCateringTransactionData {
    data: CateringTransaction,
    error: string,
    success: string
}

export interface ViewCateringTransactionDetailData {
    data: CateringTransactionDetail[],
    error: string
}

export interface InsertCateringTransactionDetailParameter {
    header: number,
    note: string,
    onlyAdditional: boolean,
    foods: number[]
}

export interface ChangeCateringTransactionDetailData {
    data: CateringTransactionDetail,
    error: string,
    success: string
}

export interface ChangeMultipleCateringTransactionDetailData {
    data: number,
    error: string,
    success: string
}

export interface ViewCateringFoodData {
    data: CateringFood[],
    error: string
}

export interface ViewOrderCateringFoodData {
    data: {
        Rice: CateringFood[],
        MainDish: CateringFood[],
        SideDish: CateringFood[],
        Vegetable: CateringFood[],
        Additional: CateringFood[],
        OnlyAdditional: CateringFood[]
    },
    error: string
}

export interface InsertCateringFoodParameter {
    name: string,
    category: CateringFoodCategory,
    additionalPrice: number,
    reductionPrice: number
}

export interface UpdateDeleteCateringFoodParameter {
    id: number
}

export interface ChangeCateringFoodData {
    data: CateringFood,
    error: string,
    success: string
}

export enum CateringPaymentType {
    NotPaid = "NotPaid",
    Pending = "Pending",
    Paid = "Paid"
}

export enum CateringFoodCategory {
    Rice = "Rice",
    MainDish = "MainDish",
    SideDish = "SideDish",
    Vegetable = "Vegetable",
    Additional = "Additional",
    OnlyAdditional = "OnlyAdditional"
}
