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
            checkMultipleUndefined(tokenData.username, transactionParameter.date, transactionParameter.basePrice))
            throw Error();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        constraintDate = currentDate.getTime();
        transactionDate = new Date(transactionParameter.date).getTime();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (transactionDate > constraintDate) {
        data.error = "Transaction date must be before the day after tomorrow.";
    } else if (transactionParameter.basePrice < 0) {
        data.error = "Base price value must be an positive number.";
    }  else {
        try {
            data.data = await prisma.cateringHeader.create({
                data: {
                    date: transactionParameter.date,
                    basePrice: transactionParameter.basePrice,
                    deliveryPrice: 5000,
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
