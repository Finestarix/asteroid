import {NextApiRequest, NextApiResponse} from "next";

import {DeleteCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function deleteMultipleCateringHeader(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let transactionParameter: DeleteCateringTransactionParameter;

    try {
        tokenData = getTokenData(request);
        transactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, transactionParameter.ids))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (transactionParameter.ids.length < 1) {
        data.error = "Detail catering transaction id cannot be empty.";
    } else {
        try {
            data.data = await prisma.cateringHeader.deleteMany({
                where: {
                    id: {
                        in: transactionParameter.ids
                    }
                }
            });
            data.success = "Successfully deleted " + transactionParameter.ids.length + " transaction(s).";
        } catch (_) {
            data.error = "Failed to deleted " + transactionParameter.ids.length + " transaction(s).";
        }
    }

    return response.status(200).json(data);
}
