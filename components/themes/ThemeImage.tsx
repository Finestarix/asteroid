import Image from "next/image";

import {useTheme} from "@mui/material/styles";


export default function ThemeButton() {

    const theme = useTheme();

    return (
        <Image alt="asteroid" width={22} height={22}
               src={theme.palette.mode === "dark" ? "/logo_light.png" : "/logo_dark.png"}
               style={{marginBottom: 1, marginLeft: 1, marginRight: 1}}/>
    );
};
