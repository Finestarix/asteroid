import {NextApiRequest, NextApiResponse} from "next";

import {InsertCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {convertDateGeneral} from "utils/date";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function createCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let transactionParameter: InsertCateringTransactionParameter;
    let constraintDate: number;
    let transactionDate: number;

    try {
        tokenData = getTokenData(request);
        transactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, transactionParameter.date, transactionParameter.basePrice))
            throw Error();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 6);
        constraintDate = currentDate.getTime();
        transactionDate = new Date(transactionParameter.date).getTime();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (transactionDate > constraintDate) {
        data.error = "Transaction date must be between today and the next one week.";
    } else if (transactionParameter.basePrice < 0) {
        data.error = "Base price value must be an positive number.";
    } else {
        try {
            data.data = await prisma.cateringHeader.create({
                data: {
                    date: transactionParameter.date,
                    basePrice: transactionParameter.basePrice,
                    deliveryPrice: 5000,
                    realDeliveryPrice: 30000,
                    active: false,
                    createdBy: {
                        connect: {
                            id: tokenData.id
                        }
                    },
                    lastUpdatedBy: {
                        connect: {
                            id: tokenData.id
                        }
                    }
                },
                include: {
                    details: {
                        select: {
                            foods: {
                                include: {
                                    food: true
                                }
                            },
                            participant: {
                                select: {
                                    username: true,
                                    alias: true
                                }
                            }
                        }
                    },
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
                }
            });
            data.success = "Successfully created catering for " + convertDateGeneral(transactionParameter.date) + ".";
        } catch (_) {
            data.error = "Failed to created catering for " + convertDateGeneral(transactionParameter.date) + ".";
        }
    }

    return response.status(200).json(data);
}
