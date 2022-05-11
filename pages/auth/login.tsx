import {useRouter} from "next/router";
import {ChangeEvent, SyntheticEvent, useState} from "react";

import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import MainLayout from "@components/layout/MainLayout";
import ThemeButton from "@components/themes/ThemeButton";
import {LoginData} from "types/userType";
import {encryptData} from "utils/encryption";
import {setSessionData, setSessionToken} from "utils/storage";


export default function LoginPage() {

    const router = useRouter();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const changeUsername = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setUsername(event.target.value);
    const changePassword = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(event.target.value);
    const changePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

    const handleLogin = async () => {
        setShowLoading(true);

        const loginFetch = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });

        const loginData: LoginData = await loginFetch.json();
        if (loginData.error) {
            setMessageAlert(loginData.error);
            setShowAlert(true);
        } else {
            setSessionToken(encryptData(loginData.token));
            setSessionData("role", encryptData(loginData.role));
            await router.push("/home");
        }
        setShowLoading(false);
    };

    const handleCloseAlert = () => setShowAlert(false);
    const handleEnter = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleLogin();
    };

    return (
        <MainLayout title="Login">

            <Box height="100vh"
                 sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>

                <Snackbar open={showAlert} autoHideDuration={5000} anchorOrigin={{vertical: "top", horizontal: "center"}}
                          onClose={handleCloseAlert}>
                    <Alert severity="error"
                           onClose={handleCloseAlert}>
                        {messageAlert}
                    </Alert>
                </Snackbar>

                <Typography component="h3" variant="h3"
                            sx={{marginBottom: 3, display: "flex", alignItems: "center", fontWeight: "bold"}}>
                    ASTER<ThemeButton/>ID
                </Typography>

                <Box component="form"
                     sx={{maxWidth: "430px", marginLeft: 2, marginRight: 2}}>

                <TextField type="text" label="Username" variant="outlined"
                               fullWidth={true} disabled={showLoading}
                               sx={{marginBottom: 2}}
                               onChange={changeUsername} onKeyDown={handleEnter}
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <PersonIcon/>
                                       </InputAdornment>
                                   ),
                               }}/>

                    <TextField type={passwordVisibility ? "text" : "password"} label="Password" variant="outlined"
                               fullWidth={true} disabled={showLoading}
                               sx={{marginBottom: 2}}
                               onChange={changePassword} onKeyDown={handleEnter}
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <KeyIcon/>
                                       </InputAdornment>
                                   ),
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton edge="end"
                                                       sx={{marginRight: 0}}
                                                       onClick={changePasswordVisibility}>
                                               {!passwordVisibility ? <VisibilityOff/> : <Visibility/>}
                                           </IconButton>
                                       </InputAdornment>
                                   ),
                               }}/>

                    <Box sx={{position: "relative", marginBottom: 1}}>
                        <Button variant="contained" size="large"
                                fullWidth={true} disabled={showLoading}
                                onClick={handleLogin}>
                            Login
                        </Button>
                        {showLoading && (
                            <CircularProgress size={24}
                                              sx={{
                                                  position: "absolute",
                                                  top: "50%",
                                                  left: "50%",
                                                  marginTop: "-12px",
                                                  marginLeft: "-12px"
                                              }}/>)}
                    </Box>

                    <Typography>
                        Do not have an account? &nbsp;
                        <Link href="/auth/register">Register Here</Link>
                    </Typography>

                </Box>

            </Box>

        </MainLayout>
    );
}
