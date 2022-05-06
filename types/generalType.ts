import {ReactElement} from "react";


export interface LayoutProps {
    children: ReactElement,
    title: string
}

export interface TableHeadKey {
    id: string,
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


