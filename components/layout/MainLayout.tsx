import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";

import {useTheme} from "@mui/material/styles";
import NextNProgress from "nextjs-progressbar";

import {LayoutProps} from "types/generalType";
import {UserRole} from "types/userType";
import {getSessionData, getSessionToken, removeSessionData, removeSessionToken} from "utils/storage";
import {decryptData} from "utils/encryption";


export default function MainLayout(props: LayoutProps) {

    const theme = useTheme();

    const router = useRouter();
    useEffect(() => {
        const authPath: string[] = ["/auth/login", "/auth/register"];
        const cateringAdminPath: string[] = ["/home/catering/manage/food", "/home/catering/manage/transaction"];
        const cateringAdminRole: string[] = [UserRole.CateringAdmin, UserRole.Owner];

        const encryptedToken = getSessionToken();
        const encryptedRole = getSessionData("role");
        let token: string;
        let role: UserRole | string;

        try {
            if ((!authPath.includes(router.pathname)) && (encryptedToken === "" || encryptedRole === ""))
                throw Error();

            token = decryptData(encryptedToken);
            role = decryptData(encryptedRole);

            if ((!authPath.includes(router.pathname)) && (!token))
                throw Error();
            else if ((cateringAdminPath.includes(router.pathname) && (!cateringAdminRole.includes(role))) ||
                (authPath.includes(router.pathname) && token))
                router.push("/home").then();
        } catch (_) {
            removeSessionToken();
            removeSessionData("role");
            router.push("/auth/login").then();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>{props.title} | Asteroid</title>
            </Head>
            <NextNProgress color={theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"}
                           height={3}
                           nonce=""
                           options={{easing: "ease", speed: 300}}
                           startPosition={0.3}
                           stopDelayMs={200}
                           showOnShallow={true}/>
            {props.children}
        </>
    );
}
