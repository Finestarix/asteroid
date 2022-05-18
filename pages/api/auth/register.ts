import {NextApiRequest, NextApiResponse} from "next";

import owasp from "owasp-password-strength-test";

import {RegisterParameter} from "types/userType";
import {prisma} from "utils/database";
import {hashString} from "utils/hash";
import {checkMultipleUndefined} from "utils/validate";


export default async function authRegister(request: NextApiRequest, response: NextApiResponse) {

    const data = {data: {}, error: ""};
    let userParameter: RegisterParameter;

    try {
        userParameter = JSON.parse(request.body);
        if (request.method !== "POST" ||
            checkMultipleUndefined(userParameter.username, userParameter.password, userParameter.confirmPassword))
            throw Error();
    } catch (_) {
        data.error = "Oops. Something went wrong.";
        return response.status(400).json(data);
    }

    const passwordCheck = owasp.test(userParameter.password);

    if (userParameter.username.length < 2 || userParameter.username.length > 64) {
        data.error = "Username length must be between 2 and 64.";
    } else if (passwordCheck.requiredTestErrors.length > 0) {
        data.error = "Password is too weak. " + passwordCheck.requiredTestErrors[0];
    } else if (userParameter.password !== userParameter.confirmPassword) {
        data.error = "Password do not match.";
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
            userParameter.password = await hashString(userParameter.password);
            try {
                data.data = await prisma.user.create({
                    data: {
                        username: userParameter.username,
                        password: userParameter.password
                    }
                });
            } catch (_) {
                data.error = "Failed to create new user.";
            }
        }
    }

    return response.status(200).json(data);
}
