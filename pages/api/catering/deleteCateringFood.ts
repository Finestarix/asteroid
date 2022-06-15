import {NextApiRequest, NextApiResponse} from "next";

import {UpdateDeleteCateringFoodParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function deleteCateringFood(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let foodParameter: UpdateDeleteCateringFoodParameter;
    let foodData;

    try {
        tokenData = getTokenData(request);
        foodParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, foodParameter.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        foodData = await prisma.cateringFood.findFirst({
            where: {
                id: foodParameter.id,
                deleted: false
            },
        });
    } catch (_) {
        data.error = "Failed to fetch catering food data.";
    }

    if (!foodData) {
        data.error = "Invalid catering food id.";
    } else {
        try {
            data.data = await prisma.cateringFood.update({
                where: {
                    id: foodParameter.id
                },
                data: {
                    active: false,
                    deleted: true,
                    lastUpdatedBy: {
                        connect: {
                            id: tokenData.id
                        }
                    }
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully deleted " + data.data.name + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to deleted " + data.data.name + ".";
        }
    }

    return response.status(200).json(data);
}
