import {NextApiRequest, NextApiResponse} from "next";

import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function getCateringTransactionHistory(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: [], error: ""};
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
        data.data = await prisma.cateringDetail.findMany({
            where: {
                participant: {
                    username: tokenData.username
                },
                deleted: false
            },
            include: {
                foods: {
                    include: {
                        food: true
                    },
                    orderBy: {
                        id: "desc"
                    }
                },
                header: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    } catch (_) {
        data.error = "Failed to fetch catering transaction history data.";
    }

    return response.status(200).json(data);
}
