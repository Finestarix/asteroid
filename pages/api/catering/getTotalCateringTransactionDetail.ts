import {NextApiRequest, NextApiResponse} from "next";

import {ViewTotalCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function getTotalCateringTransactionDetail(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: 1, error: ""};
    let tokenData: TokenData;
    let totalCateringTransactionParameter: ViewTotalCateringTransactionParameter;

    try {
        tokenData = getTokenData(request);
        totalCateringTransactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, totalCateringTransactionParameter.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        const totalData = await prisma.cateringDetail.aggregate({
            _count: true,
            where: {
                headerId: totalCateringTransactionParameter.id,
                deleted: false
            }
        });
        data.data = totalData._count + 1;
    } catch (_) {
        data.error = "Failed to fetch total catering transaction data.";
    }

    return response.status(200).json(data);
}
