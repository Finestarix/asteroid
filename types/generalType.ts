import {ReactElement} from "react";

import {CateringFood} from "types/cateringType";


export interface LayoutProps {
    children: ReactElement,
    title: string
}

export interface TableHeadKey {
    id: keyof CateringFood,
    label: string
}

export enum AlertTypeEnum {
    ERROR = "error",
    SUCCESS = "success"
}

export enum OrderTypeEnum {
    ASC = "asc",
    DESC = "desc"
}


