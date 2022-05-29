import {NextApiRequest, NextApiResponse} from "next";

import {ViewRangeDateCateringTransactionParameter} from "types/cateringType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function getCateringTransaction(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: [], error: ""};
    let tokenData: TokenData;
    let transactionData: ViewRangeDateCateringTransactionParameter;

    try {
        tokenData = getTokenData(request);
        transactionData = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, transactionData.startDate, transactionData.endDate))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.data = await prisma.cateringHeader.findMany({
            where: {
                AND: [
                    {
                        date: {
                            gte: transactionData.startDate,
                            lte: transactionData.endDate
                        }
                    },
                    {
                        deleted: false
                    }
                ]
            },
            include: {
                details: {
                    select: {
                        id: true,
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
                        },
                        onlyAdditional: true
                    },
                    orderBy: {
                        id: "asc"
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });
    } catch (_) {
        data.error = "Failed to fetch catering transaction data.";
    }

    return response.status(200).json(data);
}
