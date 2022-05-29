import {NextApiRequest, NextApiResponse} from "next";

import {CateringPaymentType} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function getNotDoneCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: [], error: ""};
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.data = await prisma.cateringDetail.findMany({
            where: {
                deleted: false,
                NOT: {
                    paymentType: CateringPaymentType.Paid
                }
            },
            include: {
                header: true,
                foods: {
                    include: {
                        food: true
                    },
                    orderBy: {
                        id: "desc"
                    }
                },
                participant: {
                    select: {
                        username: true,
                        alias: true
                    }
                }
            },
            orderBy: [
                {
                    paymentType: "asc",
                },
                {
                    participant: {
                        username: "asc"
                    },
                }
            ]
        });
    } catch (_) {
        data.error = "Failed to fetch not done catering transaction data.";
    }

    return response.status(200).json(data);
}
