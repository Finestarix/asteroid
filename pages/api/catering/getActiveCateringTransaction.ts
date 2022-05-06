import {NextApiRequest, NextApiResponse} from "next";

import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {checkMultipleUndefined} from "utils/validate";
import {getTokenData} from "utils/token";


export default async function getActiveCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: ""};
    let tokenData: TokenData;

    try {
        tokenData = getTokenData(request);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.data = await prisma.cateringHeader.findFirst({
            where: {
                active: true
            }
        });
    } catch (_) {
        data.data = [];
        data.error = "Failed to fetch catering transaction data.";
    }

    return response.status(200).json(data);
}
