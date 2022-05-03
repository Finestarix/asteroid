import {OrderTypeEnum} from "types/generalType";


export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) =>
    (b[orderBy] < a[orderBy]) ? -1 : (b[orderBy] > a[orderBy]) ? 1 : 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getComparator = <Key extends keyof any>(order: OrderTypeEnum, orderBy: Key):
    (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number =>
    order === OrderTypeEnum.DESC ?
        (a, b) => descendingComparator(a, b, orderBy) :
        (a, b) => -descendingComparator(a, b, orderBy);
