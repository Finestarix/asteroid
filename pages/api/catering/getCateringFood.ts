import {NextApiRequest, NextApiResponse} from "next";

import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function getCateringFood(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: [], error: ""};
    let tokenData: TokenData;

    try {
        tokenData = getTokenData(request);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.data = await prisma.cateringFood.findMany({
            where: {
                deleted: false
            },
            include: {
                createdBy: {
                    select: {
                        username: true,
                        alias: true
                    }
                },
                lastUpdatedBy: {
                    select: {
                        username: true,
                        alias: true
                    }
                }
            },
            orderBy: {
                active: "asc"
            }
        });
    } catch (_) {
        data.error = "Failed to fetch catering food data.";
    }

    return response.status(200).json(data);
}
