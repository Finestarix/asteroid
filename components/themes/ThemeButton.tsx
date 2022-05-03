import {useContext} from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {useTheme} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {ColorModeContext} from "@themes/colorMode";


export default function ThemeButton() {

    const theme = useTheme();

    const {darkMode, setDarkMode} = useContext(ColorModeContext);
    const changeMode = () => setDarkMode(!darkMode);

    const getTooltipTitle = (mode: string) => mode.charAt(0).toUpperCase() + mode.slice(1) + " Mode";

    return (
        <Tooltip placement="top"
                 title={getTooltipTitle(theme.palette.mode)}>
            <IconButton color="inherit"
                        onClick={changeMode}>
                {getTooltipTitle(theme.palette.mode) !== "Dark Mode" ?
                    <Brightness7Icon fontSize="large"/> :
                    <Brightness4Icon fontSize="large"/>}
            </IconButton>
        </Tooltip>
    );
};
