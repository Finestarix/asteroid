import {AppProps} from "next/app";
import Head from "next/head";
import {useEffect, useState} from "react";

import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import {useMediaQuery} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";

import {ColorModeContext} from "@themes/colorMode";
import lightTheme from "@themes/light";
import darkTheme from "@themes/dark";
import {getLocalMode, setLocalMode} from "utils/storage";


export default function MyApp({Component, pageProps}: AppProps) {

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
    useEffect(() => setDarkMode(getLocalMode() === "true"), []);

    const createEmotionCache = () => createCache({key: "css"});
    const emotionCache = createEmotionCache();

    const changeMode = (newMode: boolean) => {
        setLocalMode(newMode);
        setDarkMode(newMode);
    };

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Asteroid</title>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <ColorModeContext.Provider value={{darkMode, setDarkMode: changeMode}}>
                <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                    <CssBaseline/>
                    <Component {...pageProps} />
                </ThemeProvider>
            </ColorModeContext.Provider>
        </CacheProvider>
    );
}
