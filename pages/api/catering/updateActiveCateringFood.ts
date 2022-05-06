import {NextApiRequest, NextApiResponse} from "next";

import {UpdateCateringFoodParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updateActiveCateringFood(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let foodParameter: UpdateCateringFoodParameter;
    let foodData;

    try {
        tokenData = getTokenData(request);
        foodParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, foodParameter.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        foodData = await prisma.cateringFood.findUnique({
            where: {
                id: foodParameter.id
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
                    active: !foodData.active,
                    lastUpdatedBy: {
                        connect: {
                            username: tokenData.username
                        }
                    }
                },
                include: {
                    createdBy: true,
                    lastUpdatedBy: true
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully updated " + data.data.name + " status to " + ((data.data.active) ? "active" : "inactive") + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Failed to updated " + data.data.name + ".";
        }
    }

    return response.status(200).json(data);
}
