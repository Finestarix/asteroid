import {NextApiRequest, NextApiResponse} from "next";

import {CateringFoodCategory} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {checkMultipleUndefined} from "utils/validate";
import {getTokenData} from "utils/token";


export default async function getOrderCateringFood(request: NextApiRequest, response: NextApiResponse) {

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

    for (const category of Object.keys(CateringFoodCategory)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.data[category] = [];
    }

    try {
        const activeFoods = await prisma.cateringFood.findMany({
            where: {
                active: true
            }
        });

        for (const category of Object.keys(CateringFoodCategory)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.data[category] = activeFoods.filter((food) => food.category === category);
        }

    } catch (_) {
        data.error = "Failed to fetch catering food data.";
    }

    return response.status(200).json(data);
}
