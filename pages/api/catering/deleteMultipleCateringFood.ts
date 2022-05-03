import {NextApiRequest, NextApiResponse} from "next";

import {DeleteCateringFoodParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function deleteMultipleCateringFood(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let foodParameter: DeleteCateringFoodParameter;

    try {
        tokenData = getTokenData(request);
        foodParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, foodParameter.ids))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (foodParameter.ids.length < 1) {
        data.error = "Detail catering food id cannot be empty.";
    } else {
        try {
            data.data = await prisma.cateringFood.deleteMany({
                where: {
                    id: {
                        in: foodParameter.ids
                    }
                }
            });
            data.success = "Successfully deleted " + foodParameter.ids.length + " food(s).";
        } catch (_) {
            data.error = "Failed to deleted " + foodParameter.ids.length + " food(s).";
        }
    }

    return response.status(200).json(data);
}
