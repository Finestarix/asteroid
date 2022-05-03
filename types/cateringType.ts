import {User} from "types/userType";


export interface CateringFood {
    id: number,
    name: string,
    category: CateringFoodCategory,
    price: number,
    active: boolean,
    createdBy: User,
    createdById: number,
    lastUpdatedBy: User,
    lastUpdatedById: number
}

export interface ViewCateringFoodData {
    data: CateringFood[],
    error: string,
    success: string
}

export interface InsertCateringFoodParameter {
    name: string,
    category: CateringFoodCategory,
    price: number
}

export interface UpdateCateringFoodParameter {
    id: number;
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

export enum CateringFoodCategory {
    MainDish = "MainDish",
    SideDish = "SideDish",
    Vegetable = "Vegetable",
    Additional = "Additional"
}
