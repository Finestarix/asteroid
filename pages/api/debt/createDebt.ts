import {NextApiRequest, NextApiResponse} from "next";

import {InsertDebtHeaderParameter} from "types/debtType";
import {TokenData} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function createDebt(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: ""};
    let tokenData: TokenData;
    let debtParameter: InsertDebtHeaderParameter;
    let currentDate: number;
    let lendingDate: number;

    try {
        tokenData = getTokenData(request);
        debtParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, debtParameter.title, debtParameter.lendingTime, debtParameter.details))
            throw new Error();
        currentDate = new Date().getTime();
        lendingDate = new Date(debtParameter.lendingTime).getTime();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (debtParameter.title.length === 0) {
        data.error = "Title field cannot be empty.";
    } else if (currentDate > lendingDate) {
        data.error = "Lending date must be before the current date.";
    } else if (debtParameter.details.length === 0) {
        data.error = "Detail data cannot be empty.";
    } else {
        for (const detail of debtParameter.details) {
            let borrowerData;
            try {
                borrowerData = await prisma.user.findUnique({
                    where: {
                        id: detail.borrowerId
                    }
                });
            } catch (_) {
                data.error = "Failed to fetch borrower data.";
            }

            if (!borrowerData) {
                data.error = "Borrower data cannot be found.";
                break;
            } else if (detail.amount < 1000) {
                data.error = "Amount value must be more than or equal to 1000";
                break;
            }
        }
    }

    if (data.error.length === 0) {
        let lenderData;
        try {
            lenderData = await prisma.user.findUnique({
                where: {
                    id: tokenData.id
                }
            });
        } catch (_) {
            data.error = "Failed to fetch lender data.";
        }

        if (lenderData) {
            data.data = await prisma.debtHeader.create({
                data: {
                    lenderId: lenderData.id,
                    title: debtParameter.title,
                    lendingTime: debtParameter.lendingTime,
                    details: {
                        create: debtParameter.details.map((detail) => {
                            return {
                                borrowerId: detail.borrowerId,
                                amount: detail.amount,
                                payTime: null
                            };
                        })
                    }
                },
                include: {
                    details: true
                },
            });
        }
    }

    return response.status(200).json(data);
}
