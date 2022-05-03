import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";

import {useTheme} from "@mui/material/styles";
import NextNProgress from "nextjs-progressbar";

import {LayoutProps} from "types/generalType";
import {getSessionToken, removeSessionToken} from "utils/storage";


export default function MainLayout(props: LayoutProps) {

    const theme = useTheme();

    const router = useRouter();
    useEffect(() => {
        const handleCheckAuth = async () => {
            const authPath: string[] = ["/auth/login", "/auth/register"];
            const token = getSessionToken();

            const checkAuthFetch = await fetch("http://localhost:3000/api/auth/check", {
                method: "POST",
                headers: {
                    "authorization": token
                }
            });

            const checkAuthData = await checkAuthFetch.json();
            if ((checkAuthData.message === "Token Invalid") ||
                (!authPath.includes(router.pathname) && !token)) {
                removeSessionToken();
                router.push("/auth/login").then();
            } else if (authPath.includes(router.pathname) && token) {
                router.push("/home").then();
            }
        };
        handleCheckAuth().then();
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
