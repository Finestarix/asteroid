import {NextApiRequest, NextApiResponse} from "next";

import {TokenData} from "types/userType";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function authCheck(request: NextApiRequest, response: NextApiResponse) {

    try {
        const tokenData: TokenData = getTokenData(request);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, tokenData.role))
            throw Error();
    } catch (_) {
        return response.status(400).json({message: "Token Invalid"});
    }

    return response.status(200).json({message: "Token Valid"});
}
