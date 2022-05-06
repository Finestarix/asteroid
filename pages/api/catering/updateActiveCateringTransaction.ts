import {NextApiRequest, NextApiResponse} from "next";

import {UpdateCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";
import {convertDateGeneral} from "utils/date";


export default async function updateActiveCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let transactionParameter: UpdateCateringTransactionParameter;
    let transactionData;
    let activeTransactionData;

    try {
        tokenData = getTokenData(request);
        transactionParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, transactionParameter.id))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        transactionData = await prisma.cateringHeader.findUnique({
            where: {
                id: transactionParameter.id
            },
        });
        activeTransactionData = await prisma.cateringHeader.findFirst({
            where: {
                active: true
            },
        });
    } catch (_) {
        data.error = "Failed to fetch catering transaction data.";
    }

    if (!transactionData) {
        data.error = "Invalid catering transaction id.";
    } else if (activeTransactionData && transactionData.active === false) {
        data.error = "Only one catering transaction data can be active.";
    } else {
        try {
            data.data = await prisma.cateringHeader.update({
                where: {
                    id: transactionParameter.id
                },
                data: {
                    active: !transactionData.active,
                    lastUpdatedBy: {
                        connect: {
                            username: tokenData.username
                        }
                    }
                },
                include: {
                    createdBy: true,
                    lastUpdatedBy: true
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully updated catering for " + convertDateGeneral(data.data.date) + " status to " + ((data.data.active) ? "active" : "inactive") + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Failed to updated catering for " + convertDateGeneral(data.data.date) + ".";
        }
    }

    return response.status(200).json(data);
}
