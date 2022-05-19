import {NextApiRequest, NextApiResponse} from "next";

import {TokenData, UpdateDeleteUserParameter} from "types/userType";
import {prisma} from "utils/database";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";
import { hashString } from "../../../utils/hash";


export default async function updatePasswordUser(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let userParameter: UpdateDeleteUserParameter;
    let userData;

    try {
        tokenData = getTokenData(request);
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.username, userParameter.id))
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
            const newPassword = await hashString(userData.username + userData.username + userData.username);
            data.data = await prisma.user.update({
                where: {
                    id: userParameter.id
                },
                data: {
                    password: newPassword
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.success = "Successfully changed " + data.data.username + " password.";
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to changed " + data.data.name + " password.";
        }
    }

    return response.status(200).json(data);
}
