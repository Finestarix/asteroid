import {User} from "types/userType";


export interface CateringTransaction {
    id: number,
    date: Date,
    basePrice: number,
    deliveryPrice: number,
    active: boolean,
    createdBy: User,
    createdById: number,
    lastUpdatedBy: User,
    lastUpdatedById: number,
    details: CateringTransactionDetail[]
}

export interface CateringTransactionDetail {
    id: number,
    header: CateringTransaction,
    headerId: number,
    participant: User,
    participantId: number,
    paymentType: CateringPaymentType,
    foods: CateringTransactionParticipant[]
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
    lastUpdatedById: number
}

export interface CateringTransactionParticipant {
    id: number,
    detail: CateringTransactionDetail,
    detailId: number,
    food: CateringFood,
    foodId: number,
}

export interface ViewActiveCateringTransactionData {
    data: CateringTransaction,
    error: string
}

export interface ViewCateringTransactionData {
    data: CateringTransaction[],
    error: string
}

export interface InsertCateringTransactionParameter {
    date: Date,
    basePrice: number,
}

export interface UpdateCateringTransactionParameter {
    id: number
}

export interface ChangeCateringTransactionData {
    data: CateringTransaction,
    error: string,
    success: string
}

export interface DeleteCateringTransactionParameter {
    ids: number[]
}

export interface DeleteCateringTransactionData {
    data: number,
    error: string,
    success: string
}

export interface ViewCateringTransactionHistoryData {
    data: CateringTransactionDetail[],
    error: string
}

export interface InsertCateringTransactionDetailParameter {
    header: number,
    foods: number[]
}

export interface InsertCateringTransactionDetailData {
    data: CateringTransactionDetail,
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
    },
    error: string
}

export interface InsertCateringFoodParameter {
    name: string,
    category: CateringFoodCategory,
    additionalPrice: number,
    reductionPrice: number
}

export interface UpdateCateringFoodParameter {
    id: number
}

export interface ChangeCateringFoodData {
    data: CateringFood,
    error: string,
    success: string
}

export interface DeleteCateringFoodParameter {
    ids: number[]
}

export interface DeleteCateringFoodData {
    data: number,
    error: string,
    success: string
}

export enum CateringPaymentType {
    NotPaid = "NotPaid",
    Paid = "Paid"
}

export enum CateringFoodCategory {
    Rice = "Rice",
    MainDish = "MainDish",
    SideDish = "SideDish",
    Vegetable = "Vegetable",
    Additional = "Additional"
}
