import {NextApiRequest, NextApiResponse} from "next";

import {CateringFoodCategory, InsertCateringFoodParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function createCateringFood(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let foodParameter: InsertCateringFoodParameter;

    try {
        tokenData = getTokenData(request);
        foodParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, foodParameter.name, foodParameter.category,
                foodParameter.additionalPrice, foodParameter.reductionPrice))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (foodParameter.name.length === 0) {
        data.error = "Name field cannot be empty.";
    } else if (!Object.values(CateringFoodCategory).includes(foodParameter.category)) {
        data.error = "Category option can only consists of " + Object.values(CateringFoodCategory).join(", ") + ".";
    } else if (foodParameter.additionalPrice < 0) {
        data.error = "Additional price value must be an positive number.";
    } else if (foodParameter.reductionPrice < 0) {
        data.error = "Reduction price value must be an positive number.";
    } else {
        try {
            data.data = await prisma.cateringFood.create({
                data: {
                    name: foodParameter.name,
                    category: foodParameter.category,
                    additionalPrice: foodParameter.additionalPrice,
                    reductionPrice: foodParameter.reductionPrice,
                    active: false,
                    createdBy: {
                        connect: {
                            username: tokenData.username
                        }
                    },
                    lastUpdatedBy: {
                        connect: {
                            username: tokenData.username
                        }
                    }
                },
                include: {
                    createdBy: {
                        select: {
                            fullname: true,
                            username: true
                        }
                    },
                    lastUpdatedBy: {
                        select: {
                            fullname: true,
                            username: true
                        }
                    },
                }
            });
            data.success = "Successfully created " + foodParameter.name + ".";
        } catch (_) {
            data.error = "Failed to created " + foodParameter.name + ".";
        }
    }

    return response.status(200).json(data);
}
