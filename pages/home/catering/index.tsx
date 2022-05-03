import {useRouter} from "next/router";

import FoodBankIcon from "@mui/icons-material/FoodBank";
import Button from "@mui/material/Button";

import HomeLayout from "@components/layout/HomeLayout";


export default function CateringPage() {

    const router = useRouter();
    const gotoManageFood = () => router.push("/home/catering/food");

    return (
        <HomeLayout title="Catering">
            <Button variant="contained"
                    startIcon={<FoodBankIcon/>} fullWidth={true}
                    onClick={gotoManageFood}>
                Manage Food
            </Button>
        </HomeLayout>
    );
}
