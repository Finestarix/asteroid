import {useRouter} from "next/router";
import {useState} from "react";

import FastfoodIcon from "@mui/icons-material/Fastfood";
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
import {removeSessionToken} from "utils/storage";


export default function HomeLayout(props: LayoutProps) {

    const drawerWidth = 300;

    const [drawerMobileOpen, setDrawerMobileOpen] = useState<boolean>(false);
    const toggleDrawerMobile = () => setDrawerMobileOpen(!drawerMobileOpen);

    const router = useRouter();
    const gotoHome = async () => await router.push("/home");
    const gotoCatering = async () => await router.push("/home/catering");
    const gotoLogout = async () => {
        removeSessionToken();
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
                <ListItem key="Catering"
                          button={true}
                          onClick={gotoCatering}>
                    <ListItemIcon>
                        <FastfoodIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Catering" secondary="View and Order Your Meals"/>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem key="Logout"
                          button={true}
                          onClick={gotoLogout}>
                    <ListItemIcon>
                        <LogoutIcon/>
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
                        sx={{width: {sm: `calc(100% - ${drawerWidth}px)`}, marginLeft: {sm: `${drawerWidth}px`}}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit"
                                    sx={{marginRight: 2, display: {sm: "none"}}}
                                    onClick={toggleDrawerMobile}>
                            <MenuIcon/>
                        </IconButton>
                        <Box sx={{width: "100%"}}>
                            <Typography component="div" variant="h6">
                                {props.title} Page
                            </Typography>
                        </Box>
                        <ThemeButton/>
                    </Toolbar>
                </AppBar>

                <Box component="nav"
                     sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
                    <Drawer variant="temporary"
                            open={drawerMobileOpen}
                            ModalProps={{keepMounted: true}}
                            sx={{
                                display: {xs: "block", sm: "none"},
                                "& .MuiDrawer-paper": {boxSizing: "border-box", width: drawerWidth}
                            }}
                            onClose={toggleDrawerMobile}>
                        {drawerMenu}
                    </Drawer>
                    <Drawer variant="permanent"
                            open={true}
                            sx={{
                                display: {xs: "none", sm: "block"},
                                "& .MuiDrawer-paper": {boxSizing: "border-box", width: drawerWidth}
                            }}>
                        {drawerMenu}
                    </Drawer>
                </Box>

                <Box component="main"
                     sx={{padding: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}, flexGrow: 1, overflowX: "auto"}}>
                    <Toolbar/>
                    {props.children}
                </Box>

            </Box>

        </MainLayout>
    );
}