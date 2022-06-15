import {NextApiRequest, NextApiResponse} from "next";

import owasp from "owasp-password-strength-test";

import {TokenData, UpdatePasswordUserParameter} from "types/userType";
import {prisma} from "utils/database";
import {compareHashString, hashString} from "utils/hash";
import {getTokenData} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function updateChangePasswordUser(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: "", success: ""};
    let tokenData: TokenData;
    let userParameter: UpdatePasswordUserParameter;
    let userData;

    try {
        tokenData = getTokenData(request);
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(tokenData.id, userParameter.newPassword,
                userParameter.oldPassword, userParameter.confirmNewPassword))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    try {
        userData = await prisma.user.findFirst({
            select: {
                id: true,
                username: true,
                password: true
            },
            where: {
                id: tokenData.id,
                deleted: false
            }
        });
    } catch (_) {
        data.error = "Failed to fetch user data.";
    }

    const passwordCheck = owasp.test(userParameter.newPassword);

    if (!userData) {
        data.error = "Invalid user id.";
    } else if (passwordCheck.requiredTestErrors.length > 0) {
        data.error = "Password is too weak. " + passwordCheck.requiredTestErrors[0];
    } else if (userParameter.newPassword !== userParameter.confirmNewPassword) {
        data.error = "Password do not match.";
    } else {
        try {
            const compareResult = await compareHashString(userParameter.oldPassword, userData.password);
            if (!compareResult) {
                data.error = "Invalid user password.";
            } else {
                const newPassword = await hashString(userParameter.newPassword);
                data.data = await prisma.user.update({
                    where: {
                        id: tokenData.id
                    },
                    data: {
                        password: newPassword
                    }
                });
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.success = "Successfully changed " + data.data.username + " password.";
            }
        } catch (_) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.error = "Failed to changed " + data.data.name + " password.";
        }
    }

    return response.status(200).json(data);
}
