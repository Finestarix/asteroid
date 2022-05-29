import {useEffect, useState} from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import HomeLayout from "@components/layout/HomeLayout";
import {UserRole} from "types/userType";
import {decryptData} from "utils/encryption";
import {getSessionData} from "utils/storage";


export default function HomePage() {

    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<UserRole | string>("");

    useEffect(() => {
        setUsername(decryptData(getSessionData("username")));
        setRole(decryptData(getSessionData("role")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <HomeLayout title="Home">
            <Box>
                <Typography variant="h6">
                    Welcome, {username} ({role})
                </Typography>


            </Box>
        </HomeLayout>
    );
}
