import {NextApiRequest} from "next";

import {sign, verify} from "jsonwebtoken";

import {TokenData} from "types/userType";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const key: string = process.env.JWT_KEY;

export const generateToken = (data: TokenData) => sign({data: data}, key, {expiresIn: "7d"});

export const getTokenData = (request: NextApiRequest) => {
    const token = request.headers.authorization;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (token) ? verify(token, key).data : "";
};
