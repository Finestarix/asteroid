import {NextApiRequest, NextApiResponse} from "next";

import {CateringPaymentType} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updatePendingCateringTransactionDetail(request: NextApiRequest, response: NextApiResponse) {

    const data = {error: "", success: ""};
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

    try {
        await prisma.cateringDetail.updateMany({
            where: {
                AND: [
                    {
                        participant: {
                            username: tokenData.username
                        }
                    },
                    {
                        paymentType: CateringPaymentType.NotPaid
                    }
                ]
            },
            data: {
                paymentType: CateringPaymentType.Pending,
                payTime: new Date()
            }
        });
        data.success = "Successfully updated catering payment status to pending.";
    } catch (_) {
        data.error = "Failed to updated catering payment status to pending.";
    }

    return response.status(200).json(data);
}
