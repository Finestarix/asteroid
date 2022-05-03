import {NextApiRequest, NextApiResponse} from "next";

import {passwordStrength} from "check-password-strength";

import * as AvatarType from "types/avatarType";
import {RegisterParameter} from "types/userType";
import {prisma} from "utils/database";
import {hashString} from "utils/encryption";
import {randomEnum} from "utils/random";
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

    if (userParameter.username.length < 4 || userParameter.username.length > 64) {
        data.error = "Username length must be between 4 and 64.";
    } else if (passwordStrength(userParameter.password).id <= 0) {
        data.error = "Password is too weak. Password must use at least 6 character and " +
            "contains one upper case letter, one lower case letter, and one numeric character.";
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
                        password: userParameter.password,
                        avatar: {
                            create: {
                                topType: randomEnum(AvatarType.TopType),
                                accessoriesType: randomEnum(AvatarType.AccessoriesType),
                                hairColor: randomEnum(AvatarType.HairColor),
                                facialHairType: randomEnum(AvatarType.FacialHairType),
                                facialHairColor: randomEnum(AvatarType.FacialHairColor),
                                clotheType: randomEnum(AvatarType.ClotheType),
                                clotheColor: randomEnum(AvatarType.ClotheColor),
                                eyeType: randomEnum(AvatarType.EyeType),
                                eyebrowType: randomEnum(AvatarType.EyebrowType),
                                mouthType: randomEnum(AvatarType.MouthType),
                                skinColor: randomEnum(AvatarType.SkinColor)
                            }
                        }
                    }
                });
            } catch (_) {
                data.error = "Failed to create new user.";
            }
        }
    }

    return response.status(200).json(data);
}
