import {useRouter} from "next/router";
import {useEffect, useState} from "react";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DinnerDiningOutlinedIcon from "@mui/icons-material/DinnerDiningOutlined";
import FaceIcon from "@mui/icons-material/Face";
import GroupIcon from "@mui/icons-material/Group";
import MicrowaveOutlinedIcon from "@mui/icons-material/MicrowaveOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MainLayout from "@components/layout/MainLayout";
import ThemeButton from "@components/themes/ThemeButton";
import ThemeImage from "@components/themes/ThemeImage";
import {LayoutProps} from "types/generalType";
import {UserRole} from "types/userType";
import {decryptData} from "utils/encryption";
import {getSessionData, removeSessionData, removeSessionToken} from "utils/storage";


export default function HomeLayout(props: LayoutProps) {

    const drawerWidth = 270;

    const [drawerMobileOpen, setDrawerMobileOpen] = useState<boolean>(false);
    const [role, setRole] = useState<UserRole | string>("");

    useEffect(() => {
        setRole(decryptData(getSessionData("role")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleDrawerMobile = () => setDrawerMobileOpen(!drawerMobileOpen);

    const cateringAdminRole: string[] = [UserRole.CateringAdmin, UserRole.Owner];
    const userAdminRole: string[] = [UserRole.Owner];

    const router = useRouter();
    const gotoHome = async () => await router.push("/home");
    const gotoCatering = async () => await router.push("/home/catering");
    const gotoCateringAuto = async () => await router.push("/home/catering/auto");
    const gotoCateringHistory = async () => await router.push("/home/catering/history");
    const gotoProfile = async () => await router.push("/home/user");
    const gotoCateringFood = () => router.push("/home/catering/manage/food");
    const gotoCateringTransaction = () => router.push("/home/catering/manage/transaction");
    const gotoCateringPayment = () => router.push("/home/catering/manage/payment");
    const gotoUser = () => router.push("/home/user/manage");
    const gotoLogout = async () => {
        removeSessionToken();
        removeSessionData("username");
        removeSessionData("role");
        await router.push("/auth/login");
    };

    const drawerMenu = (
        <>
            <Toolbar>
                <Typography component="h4" variant="h4"
                            sx={{display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer"}}
                            onClick={gotoHome}>
                    ASTER<ThemeImage/>ID
                </Typography>
            </Toolbar>
            <Divider/>
            <List>
                <ListItemButton selected={router.pathname === "/home/catering"}
                                onClick={gotoCatering}>
                    <ListItemIcon>
                        <RestaurantOutlinedIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Catering Order"/>
                </ListItemButton>
                {(cateringAdminRole.includes(role)) &&
                    <>
                        <ListItemButton selected={router.pathname === "/home/catering/manage/transaction"}
                                        onClick={gotoCateringAuto}>
                            <ListItemIcon>
                                <AutoFixHighIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Catering Order Auto"/>
                        </ListItemButton>
                    </>}
                <ListItemButton selected={router.pathname === "/home/catering/history"}
                                onClick={gotoCateringHistory}>
                    <ListItemIcon>
                        <ReceiptLongOutlinedIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Catering History"/>
                </ListItemButton>
                {(cateringAdminRole.includes(role)) &&
                    <>
                        <ListItemButton selected={router.pathname === "/home/catering/manage/transaction"}
                                        onClick={gotoCateringTransaction}>
                            <ListItemIcon>
                                <MicrowaveOutlinedIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Manage Transaction"/>
                        </ListItemButton>
                        <ListItemButton selected={router.pathname === "/home/catering/manage/food"}
                                        onClick={gotoCateringFood}>
                            <ListItemIcon>
                                <DinnerDiningOutlinedIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Manage Food"/>
                        </ListItemButton>
                        <ListItemButton selected={router.pathname === "/home/catering/manage/payment"}
                                        onClick={gotoCateringPayment}>
                            <ListItemIcon>
                                <PointOfSaleIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Manage Payment"/>
                        </ListItemButton>
                    </>}
            </List>
            <Divider/>
            <List>
                <ListItemButton selected={router.pathname === "/home/user"}
                                onClick={gotoProfile}>
                    <ListItemIcon>
                        <FaceIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Profile"/>
                </ListItemButton>
                {(userAdminRole.includes(role)) &&
                    <>
                        <ListItemButton selected={router.pathname === "/home/user/manage"}
                                        onClick={gotoUser}>
                            <ListItemIcon>
                                <GroupIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Manage User"/>
                        </ListItemButton>
                    </>}
            </List>
            <Divider/>
            <List>
                <ListItemButton onClick={gotoLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Logout"/>
                </ListItemButton>
            </List>
        </>
    );

    return (
        <MainLayout title={props.title}>

            <Box sx={{display: "flex"}}>

                <AppBar position="fixed"
                        sx={{width: {md: `calc(100% - ${drawerWidth}px)`}, marginLeft: {md: `${drawerWidth}px`}}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit"
                                    sx={{marginRight: 2, display: {md: "none"}}}
                                    onClick={toggleDrawerMobile}>
                            <MenuIcon/>
                        </IconButton>
                        <Box sx={{width: "100%"}}>
                            <Typography component="div" variant="h6">
                                {props.title}
                            </Typography>
                        </Box>
                        <ThemeButton/>
                    </Toolbar>
                </AppBar>

                <Box component="nav"
                     sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}>
                    <Drawer variant="temporary"
                            open={drawerMobileOpen}
                            ModalProps={{keepMounted: true}}
                            sx={{
                                display: {xs: "block", md: "none"},
                                "& .MuiDrawer-paper": {boxSizing: "border-box", width: drawerWidth}
                            }}
                            onClose={toggleDrawerMobile}>
                        {drawerMenu}
                    </Drawer>
                    <Drawer variant="permanent"
                            open={true}
                            sx={{
                                display: {xs: "none", md: "block"},
                                "& .MuiDrawer-paper": {boxSizing: "border-box", width: drawerWidth}
                            }}>
                        {drawerMenu}
                    </Drawer>
                </Box>

                <Box component="main"
                     sx={{
                         padding: 3,
                         width: {md: `calc(100% - ${drawerWidth}px)`},
                         flexGrow: 1,
                         overflowX: "auto"
                     }}>
                    <Toolbar/>
                    {props.children}
                </Box>

            </Box>

        </MainLayout>
    );
}
