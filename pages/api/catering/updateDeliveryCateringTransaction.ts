import {NextApiRequest, NextApiResponse} from "next";

import {UpdateDeleteCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {calculateDeliveryPrice} from "utils/calculator";
import {convertDateGeneral} from "utils/date";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updateDeliveryCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let transactionParameter: UpdateDeleteCateringTransactionParameter;
    let transactionData;

    try {
        tokenData = getTokenData(request);
        transactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, transactionParameter.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        transactionData = await prisma.cateringHeader.findFirst({
            select: {
                date: true,
                _count: true
            },
            where: {
                id: transactionParameter.id,
                deleted: false
            }
        });
    } catch (_) {
        data.error = "Failed to fetch catering transaction data.";
    }

    if (!transactionData) {
        data.error = "Invalid catering transaction id.";
    } else {
        const deliveryPrice = calculateDeliveryPrice(transactionData._count.details);
        try {
            data.data = await prisma.cateringHeader.update({
                where: {
                    id: transactionParameter.id
                },
                data: {
                    deliveryPrice: deliveryPrice,
                    lastUpdatedBy: {
                        connect: {
                            id: tokenData.id
                        }
                    }
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully updated catering delivery price for " + convertDateGeneral(data.data.date) + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to updated catering delivery price for " + convertDateGeneral(data.data.date) + ".";
        }
    }

    return response.status(200).json(data);
}
