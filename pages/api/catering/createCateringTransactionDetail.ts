import {NextApiRequest, NextApiResponse} from "next";

import {InsertCateringTransactionDetailParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function createCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let transactionDetailParameter: InsertCateringTransactionDetailParameter;

    try {
        tokenData = getTokenData(request);
        transactionDetailParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, transactionDetailParameter.header, transactionDetailParameter.foods,
                transactionDetailParameter.note, transactionDetailParameter.onlyAdditional))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        data.data = await prisma.cateringDetail.create({
            data: {
                header: {
                    connect: {
                        id: transactionDetailParameter.header
                    }
                },
                participant: {
                    connect: {
                        username: tokenData.username
                    }
                },
                note: transactionDetailParameter.note,
                onlyAdditional: transactionDetailParameter.onlyAdditional,
                paymentType: "NotPaid",
                foods: {
                    create: transactionDetailParameter.foods.map((food) => {
                        return {
                            food: {
                                connect: {
                                    id: food
                                }
                            }
                        };
                    })
                }
            },
            include: {
                header: true,
                participant: true,
                foods: true
            }
        });
        data.success = "Successfully created catering order.";
    } catch (_) {
        data.error = "Failed to created catering order.";
    }

    return response.status(200).json(data);
}
