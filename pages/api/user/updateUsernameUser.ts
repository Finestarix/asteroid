import {NextApiRequest, NextApiResponse} from "next";

import { TokenData, UpdateUsernameUserParameter } from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updateAliasUser(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let userParameter: UpdateUsernameUserParameter;
    let userData;

    try {
        tokenData = getTokenData(request);
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, userParameter.username))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        userData = await prisma.user.findFirst({
            select: {
                id: true,
                username: true
            },
            where: {
                username: tokenData.username,
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
                    username: tokenData.username
                },
                data: {
                    username: userParameter.username
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully updated " + tokenData.username + " to " + data.data.username + ".";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to updated " + tokenData.username + " username.";
        }
    }

    return response.status(200).json(data);
}
