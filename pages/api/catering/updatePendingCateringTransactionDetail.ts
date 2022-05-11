import {NextApiRequest, NextApiResponse} from "next";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updatePendingCateringTransactionDetail(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
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
        data.data = await prisma.cateringDetail.updateMany({
            where: {
                AND: [
                    {
                        participant: {
                            username: tokenData.username
                        }
                    },
                    {
                        paymentType: "NotPaid"
                    }
                ]
            },
            data: {
                paymentType: "Pending",
                payTime: new Date()
            }
        });
        data.success = "Successfully updated catering payment status to pending.";
    } catch (_) {
        data.error = "Failed to updated catering payment status to pending.";
    }

    return response.status(200).json(data);
}
