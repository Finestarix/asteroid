import {NextApiRequest, NextApiResponse} from "next";

import {CateringPaymentType, UpdatePaymentCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updatePaidCateringTransactionDetail(request: NextApiRequest, response: NextApiResponse) {

    const data = {error: "", success: ""};
    let tokenData: TokenData;
    let transactionParameter: UpdatePaymentCateringTransactionParameter;

    try {
        tokenData = getTokenData(request);
        transactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, transactionParameter.ids))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        await prisma.cateringDetail.updateMany({
            where: {
                id: {
                    in: transactionParameter.ids
                }
            },
            data: {
                paymentType: CateringPaymentType.Paid,
                approveTime: new Date()
            }
        });
        data.success = "Successfully updated catering payment status to paid.";
    } catch (_) {
        data.error = "Failed to updated catering payment status to paid.";
    }

    return response.status(200).json(data);
}
