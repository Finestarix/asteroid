import {NextApiRequest, NextApiResponse} from "next";

import {TokenData, UpdateUsernameUserParameter} from "types/userType";
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
            checkMultipleUndefined(tokenData.id, userParameter.username))
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
                id: tokenData.id,
                deleted: false
            }
        });
    } catch (_) {
        data.error = "Failed to fetch user data.";
    }

    if (!userData) {
        data.error = "Invalid user id.";
    } else if (userData.username === userParameter.username) {
        data.error = "Username you want to change must be different.";
    } else {
        let userData;
        try {
            userData = await prisma.user.findUnique({
                where: {
                    username: userParameter.username,
                },
            });
        } catch (_) {
            data.error = "Failed to fetch user data.";
        }

        if (userData) {
            data.error = "Username has already been taken.";
        } else {
            try {
                data.data = await prisma.user.update({
                    where: {
                        id: tokenData.id
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
    }

    return response.status(200).json(data);
}
