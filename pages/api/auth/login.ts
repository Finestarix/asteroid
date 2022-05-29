import {NextApiRequest, NextApiResponse} from "next";

import {UserStatus, LoginParameter, TokenData} from "types/userType";
import {prisma} from "utils/database";
import {compareHashString} from "utils/hash";
import {generateToken} from "utils/token";
import {checkMultipleUndefined} from "utils/validate";


export default async function authLogin(request: NextApiRequest, response: NextApiResponse) {

    const data = {username: "", role: "", token: "", error: ""};
    let userParameter: LoginParameter;

    try {
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(userParameter.username, userParameter.password))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    if (userParameter.username.length === 0) {
        data.error = "Username field cannot be empty.";
    } else if (userParameter.password.length === 0) {
        data.error = "Password field cannot be empty.";
    } else {
        let userData;
        try {
            userData = await prisma.user.findUnique({
                select: {
                    id: true,
                    password: true,
                    role: true,
                    status: true,
                    deleted: true
                },
                where: {
                    username: userParameter.username,
                },
            });
        } catch (_) {
            data.error = "Failed to fetch user data.";
        }

        if (!userData) {
            data.error = "Invalid user credential.";
        } else if (userData.deleted) {
            data.error = "Your account has been deleted.";
        } else if (userData.status === UserStatus.Requested) {
            data.error = "Your account is waiting to be approved by the admin.";
        } else if (userData.status === UserStatus.Blocked) {
            data.error = "Your account has been blocked.";
        } else {
            const compareResult = await compareHashString(userParameter.password, userData.password);
            if (!compareResult) {
                data.error = "Invalid user credential.";
            } else {
                const tokenData: TokenData = {
                    id: userData.id,
                    username: userParameter.username,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    role: userData.role,
                };
                data.token = generateToken(tokenData);
                data.username = userParameter.username;
                data.role = userData.role;
            }
        }
    }

    return response.status(200).json(data);
}
