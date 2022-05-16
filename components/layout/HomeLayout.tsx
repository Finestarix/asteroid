import {useRouter} from "next/router";
import {useEffect, useState} from "react";

import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import MicrowaveOutlinedIcon from "@mui/icons-material/MicrowaveOutlined";
import DinnerDiningOutlinedIcon from "@mui/icons-material/DinnerDiningOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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
    const debtAdminRole: string[] = [UserRole.DebtAdmin, UserRole.Owner];

    const router = useRouter();
    const gotoHome = async () => await router.push("/home");
    const gotoCatering = async () => await router.push("/home/catering");
    const gotoCateringHistory = async () => await router.push("/home/catering/history");
    const gotoCateringFood = () => router.push("/home/catering/manage/food");
    const gotoCateringTransaction = () => router.push("/home/catering/manage/transaction");
    const gotoCateringPayment = () => router.push("/home/catering/manage/payment");
    const gotoLogout = async () => {
        removeSessionToken();
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
                <ListItem button={true}
                          onClick={gotoCatering}>
                    <ListItemIcon>
                        <RestaurantOutlinedIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Catering Order"/>
                </ListItem>
                <ListItem button={true}
                          onClick={gotoCateringHistory}>
                    <ListItemIcon>
                        <ReceiptLongOutlinedIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Catering History"/>
                </ListItem>
            </List>
            <Divider/>
            {(cateringAdminRole.includes(role)) &&
                <>
                    <List>
                        <ListItem button={true}
                                  onClick={gotoCateringTransaction}>
                            <ListItemIcon>
                                <MicrowaveOutlinedIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Catering Transaction"/>
                        </ListItem>
                        <ListItem button={true}
                                  onClick={gotoCateringFood}>
                            <ListItemIcon>
                                <DinnerDiningOutlinedIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Catering Food"/>
                        </ListItem>
                        <ListItem button={true}
                                  onClick={gotoCateringPayment}>
                            <ListItemIcon>
                                <PointOfSaleIcon fontSize="medium"/>
                            </ListItemIcon>
                            <ListItemText primary="Catering Payment"/>
                        </ListItem>
                    </List>
                    <Divider/>
                </>}
            <List>
                <ListItem button={true}
                          onClick={gotoLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="medium"/>
                    </ListItemIcon>
                    <ListItemText primary="Logout"/>
                </ListItem>
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
                     sx={{padding: 3, width: {md: `calc(100% - ${drawerWidth}px)`}, flexGrow: 1, overflowX: "auto"}}>
                    <Toolbar/>
                    {props.children}
                </Box>

            </Box>

        </MainLayout>
    );
}
