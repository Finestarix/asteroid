import {NextApiRequest, NextApiResponse} from "next";

import {TokenData, UpdateRoleUserParameter} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updateRoleUser(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let userParameter: UpdateRoleUserParameter;
    let userData;

    try {
        tokenData = getTokenData(request);
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, userParameter.id, userParameter.role))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        userData = await prisma.user.findFirst({
            where: {
                id: userParameter.id,
                deleted: false
            }
        });
    } catch (_) {
        data.error = "Failed to fetch user data.";
    }

    if (!userData) {
        data.error = "Invalid user id.";
    } else {
        try {
            data.data = await prisma.user.update({
                where: {
                    id: userParameter.id
                },
                data: {
                    role: userParameter.role
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully updated " + data.data.username + " role to " + userParameter.role + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to updated " + data.data.name + ".";
        }
    }

    return response.status(200).json(data);
}
