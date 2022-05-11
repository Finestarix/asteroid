import {hash, compare} from "bcrypt";


const saltRounds = 10;

export const hashString = async (plain: string) => await hash(plain, saltRounds);
export const compareHashString = async (plain: string, hash: string) => await compare(plain, hash);
