import {createContext} from "react";


export const ColorModeContext = createContext({
    darkMode: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    setDarkMode: (mode: boolean) => {}
});
