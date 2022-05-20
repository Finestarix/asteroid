import { useRouter } from "next/router";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Alert, { AlertColor } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import HomeLayout from "@components/layout/HomeLayout";
import { AlertTypeEnum } from "types/generalType";
import { UpdateDeleteUserData, User, ViewUserData } from "types/userType";
import { decryptData } from "utils/encryption";
import { getSessionToken, removeSessionData, removeSessionToken } from "utils/storage";


export default function ProfileUserPage() {

    const router = useRouter();

    const [user, setUser] = useState<User>();
    const [username, setUsername] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [oldPasswordVisibility, setOldPasswordVisibility] = useState<boolean>(false);
    const [newPasswordVisibility, setNewPasswordVisibility] = useState<boolean>(false);
    const [confirmNewPasswordVisibility, setConfirmNewPasswordVisibility] = useState<boolean>(false);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showLoadingUsernameForm, setShowLoadingUsernameForm] = useState<boolean>(false);
    const [showLoadingPasswordForm, setShowLoadingPasswordForm] = useState<boolean>(false);

    useEffect(() => {
        const handleViewProfileUser = async () => {
            setShowLoading(true);

            const profileUserFetch = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });

            const profileUserData: ViewUserData = await profileUserFetch.json();

            setUser(profileUserData.data);
            setUsername(profileUserData.data.username);
            setShowLoading(false);
        };
        handleViewProfileUser().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeUsername = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setUsername(event.target.value);
    const changeOldPassword = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setOldPassword(event.target.value);
    const changeNewPassword = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setNewPassword(event.target.value);
    const changeConfirmNewPassword = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConfirmNewPassword(event.target.value);
    const changeOldPasswordVisibility = () => setOldPasswordVisibility(!oldPasswordVisibility);
    const changeNewPasswordVisibility = () => setNewPasswordVisibility(!newPasswordVisibility);
    const changeConfirmNewPasswordVisibility = () => setConfirmNewPasswordVisibility(!confirmNewPasswordVisibility);

    const handleCloseAlert = () => setShowAlert(false);
    const handleEnterChangeUsername = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleChangeUsernameUser();
    };
    const handleEnterChangePassword = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleChangePasswordUser();
    };

    const handleChangeUsernameUser = async () => {
        setShowLoadingUsernameForm(true);

        const updateUsernameUserFetch = await fetch("/api/user/updateUsernameUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                id: user.id,
                username: username
            })
        });

        const updateUsernameUserData: UpdateDeleteUserData = await updateUsernameUserFetch.json();
        if (updateUsernameUserData.error) {
            setMessageAlert(updateUsernameUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            user.username = updateUsernameUserData.data.username;
            setMessageAlert(updateUsernameUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            removeSessionToken();
            removeSessionData("role");
            await router.push("/auth/login");
        }
        setShowAlert(true);
        setShowLoadingUsernameForm(false);
    };

    const handleChangePasswordUser = async () => {
        setShowLoadingPasswordForm(true);

        const updatePasswordUserFetch = await fetch("/api/user/updateChangePasswordUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            })
        });

        const updatePasswordUserData: UpdateDeleteUserData = await updatePasswordUserFetch.json();
        if (updatePasswordUserData.error) {
            setMessageAlert(updatePasswordUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMessageAlert(updatePasswordUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }
        setShowAlert(true);
        setShowLoadingPasswordForm(false);
    };

    return (
        <HomeLayout title="Profile">
            <>

                <Backdrop open={showLoading}
                          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress size={50}
                                      sx={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          marginTop: "-25px",
                                          marginLeft: "-25px"
                                      }} />
                </Backdrop>

                <Snackbar open={showAlert} autoHideDuration={5000}
                          anchorOrigin={{ vertical: "top", horizontal: "center" }}
                          onClose={handleCloseAlert}>
                    <Alert severity={typeAlert}
                           onClose={handleCloseAlert}>
                        {messageAlert}
                    </Alert>
                </Snackbar>

                {(user) && (
                    <>
                        <Paper sx={{ padding: 2, marginBottom: 2 }}>

                            <Typography variant="body1">
                                Change Username
                            </Typography>

                            <Box component="form"
                                 sx={{ paddingTop: 2 }}>

                                <TextField type="text" label="Username" variant="outlined" size="medium"
                                           fullWidth={true} disabled={showLoadingUsernameForm} value={username}
                                           sx={{ marginBottom: 2 }}
                                           onChange={changeUsername} onKeyDown={handleEnterChangeUsername}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <PersonIcon />
                                                   </InputAdornment>
                                               )
                                           }} />

                                <Alert variant="outlined" severity="info"
                                       sx={{ marginBottom: 2 }}>
                                    You will be <b>signed out</b> when you change your username.
                                </Alert>

                                <Box sx={{ position: "relative" }}>
                                    <Button variant="contained" size="large" color="warning"
                                            fullWidth={true} disabled={showLoadingUsernameForm}
                                            onClick={handleChangeUsernameUser}>
                                        Update
                                    </Button>
                                    {showLoadingUsernameForm && (
                                        <CircularProgress size={24}
                                                          sx={{
                                                              position: "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              marginTop: "-12px",
                                                              marginLeft: "-12px"
                                                          }} />)}
                                </Box>

                            </Box>

                        </Paper>

                        <Paper sx={{ padding: 2 }}>

                            <Typography variant="body1">
                                Change Password
                            </Typography>

                            <Box component="form"
                                 sx={{ paddingTop: 2 }}>

                                <TextField type={oldPasswordVisibility ? "text" : "password"}
                                           label="Old Password" variant="outlined" size="medium"
                                           fullWidth={true} disabled={showLoadingPasswordForm} value={oldPassword}
                                           sx={{ marginBottom: 2 }}
                                           onChange={changeOldPassword} onKeyDown={handleEnterChangePassword}
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
                                                                   onClick={changeOldPasswordVisibility}>
                                                           {!oldPasswordVisibility ? <VisibilityOff/> : <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }} />

                                <TextField type={newPasswordVisibility ? "text" : "password"}
                                           label="New Password" variant="outlined" size="medium"
                                           fullWidth={true} disabled={showLoadingPasswordForm} value={newPassword}
                                           sx={{ marginBottom: 2 }}
                                           onChange={changeNewPassword} onKeyDown={handleEnterChangePassword}
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
                                                                   onClick={changeNewPasswordVisibility}>
                                                           {!newPasswordVisibility ? <VisibilityOff/> : <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }} />

                                <TextField type={confirmNewPasswordVisibility ? "text" : "password"}
                                           label="Confirm New Password" variant="outlined" size="medium"
                                           fullWidth={true} disabled={showLoadingPasswordForm} value={confirmNewPassword}
                                           sx={{ marginBottom: 2 }}
                                           onChange={changeConfirmNewPassword} onKeyDown={handleEnterChangePassword}
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
                                                                   onClick={changeConfirmNewPasswordVisibility}>
                                                           {!confirmNewPasswordVisibility ? <VisibilityOff/> : <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }} />

                                <Box sx={{ position: "relative" }}>
                                    <Button variant="contained" size="large" color="warning"
                                            fullWidth={true} disabled={showLoadingPasswordForm}
                                            onClick={handleChangePasswordUser}>
                                        Update
                                    </Button>
                                    {showLoadingPasswordForm && (
                                        <CircularProgress size={24}
                                                          sx={{
                                                              position: "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              marginTop: "-12px",
                                                              marginLeft: "-12px"
                                                          }} />)}
                                </Box>

                            </Box>

                        </Paper>
                    </>
                )}

            </>
        </HomeLayout>
    );
}
