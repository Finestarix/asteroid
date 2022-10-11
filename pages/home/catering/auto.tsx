import {ChangeEvent, useEffect, useState} from "react";

import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Alert, {AlertColor} from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringFood,
    CateringTransaction,
    ChangeCateringTransactionDetailData,
    ViewActiveCateringTransactionData,
    ViewOrderCateringFoodData
} from "types/cateringType";
import {AlertTypeEnum} from "types/generalType";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";
import {User, UserStatus, ViewUsersData} from "../../../types/userType";
import MenuItem from "@mui/material/MenuItem";


export default function CateringOrderPage() {

    const [transaction, setTransaction] = useState<CateringTransaction>();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>();
    const [rice, setRice] = useState<CateringFood[]>([]);
    const [mainDish, setMainDish] = useState<CateringFood[]>([]);
    const [sideDish, setSideDish] = useState<CateringFood[]>([]);
    const [vegetable, setVegetable] = useState<CateringFood[]>([]);
    const [additional, setAdditional] = useState<CateringFood[]>([]);
    const [selectedRice, setSelectedRice] = useState<number>(0);
    const [selectedMainDish, setSelectedMainDish] = useState<number>(0);
    const [selectedSideDish, setSelectedSideDish] = useState<number>(0);
    const [selectedVegetable, setSelectedVegetable] = useState<number>(0);
    const [selectedAdditional, setSelectedAdditional] = useState<number[]>([]);
    const [note, setNote] = useState<string>("");
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        const handleViewCateringOrder = async () => {
            setShowLoading(true);

            const cateringTransactionFetch = await fetch("/api/catering/getActiveCateringTransaction", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });
            const cateringTransactionData: ViewActiveCateringTransactionData = await cateringTransactionFetch.json();
            setTransaction(cateringTransactionData.data);

            if (cateringTransactionData.data) {
                const cateringFoodFetch = await fetch("/api/catering/getOrderCateringFood", {
                    method: "POST",
                    headers: {
                        "authorization": decryptData(getSessionToken())
                    }
                });
                const cateringFoodData: ViewOrderCateringFoodData = await cateringFoodFetch.json();

                const usersFetch = await fetch("/api/user/getUsers", {
                    method: "POST",
                    headers: {
                        "authorization": decryptData(getSessionToken())
                    },
                    body: JSON.stringify({
                        id: cateringTransactionData.data.id
                    })
                });
                const usersData: ViewUsersData = await usersFetch.json();

                setRice(cateringFoodData.data.Rice);
                setMainDish(cateringFoodData.data.MainDish);
                setSideDish(cateringFoodData.data.SideDish);
                setVegetable(cateringFoodData.data.Vegetable);
                setAdditional(cateringFoodData.data.Additional);
                setUsers(usersData.data.filter(user => user.status === UserStatus.Accepted));
                setSelectedUser(usersData.data[0].username);
            }
            setShowLoading(false);
        };

        handleViewCateringOrder().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCloseAlert = () => setShowAlert(false);

    const changeSelectedUser = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setSelectedUser(event.target.value);
    const handleSelectedRice = (event: ChangeEvent<HTMLInputElement>) => setSelectedRice(parseInt(event.target.value));
    const handleSelectedMainDish = (event: ChangeEvent<HTMLInputElement>) => setSelectedMainDish(parseInt(event.target.value));
    const handleSelectedSideDish = (event: ChangeEvent<HTMLInputElement>) => setSelectedSideDish(parseInt(event.target.value));
    const handleSelectedVegetable = (event: ChangeEvent<HTMLInputElement>) => setSelectedVegetable(parseInt(event.target.value));
    const handleSelectedAdditional = (id: number) => {
        const selectedIndex = selectedAdditional.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedAdditional, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedAdditional.slice(1));
        } else if (selectedIndex === selectedAdditional.length - 1) {
            newSelected = newSelected.concat(selectedAdditional.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selectedAdditional.slice(0, selectedIndex), selectedAdditional.slice(selectedIndex + 1));
        }
        setSelectedAdditional(newSelected);
    };
    const handleNote = (event: ChangeEvent<HTMLInputElement>) => setNote(event.target.value);

    const handleCreateCateringOrder = async () => {
        setShowLoading(true);

        const createCateringOrderFetch = await fetch("/api/catering/createCateringTransactionDetailAuto", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                header: transaction.id,
                username: selectedUser,
                note: note,
                foods: [selectedRice, selectedMainDish, selectedSideDish, selectedVegetable, ...selectedAdditional]
                    .filter((food) => food != 0 && food != -1)
            }),
        });

        const createCateringOrderData: ChangeCateringTransactionDetailData = await createCateringOrderFetch.json();
        if (createCateringOrderData.error) {
            setMessageAlert(createCateringOrderData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            setMessageAlert(createCateringOrderData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    return (
        <HomeLayout title="Catering Order (Auto)">
            <>

                <Backdrop open={showLoading}
                          sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <CircularProgress size={50}
                                      sx={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          marginTop: "-25px",
                                          marginLeft: "-25px"
                                      }}/>
                </Backdrop>

                <Snackbar open={showAlert} autoHideDuration={5000}
                          anchorOrigin={{vertical: "top", horizontal: "center"}}
                          onClose={handleCloseAlert}>
                    <Alert severity={typeAlert}
                           onClose={handleCloseAlert}>
                        {messageAlert}
                    </Alert>
                </Snackbar>

                {(transaction && selectedUser) ? (
                    <Paper sx={{padding: 2}}>

                        <Typography variant="h6"
                                    sx={{paddingBottom: 2}}>
                            Catering for {convertDateGeneral(transaction.date)}
                        </Typography>

                        <Typography variant="body1" sx={{marginTop: 1, fontWeight: "bold"}}>User</Typography>
                        <TextField select variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoading} value={selectedUser}
                                   sx={{width: "100%", maxWidth: "500px"}}
                                   onChange={changeSelectedUser}>
                            {users.map((option) => (
                                (option.status === UserStatus.Accepted) ?
                                <MenuItem key={option.id} value={option.username}>
                                    {option.username} ({option.alias ? option.alias : "-"})
                                </MenuItem> : <></>))}
                        </TextField>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Rice Portion</Typography>
                        <RadioGroup onChange={handleSelectedRice}>
                            {rice.map((food) => (
                                <Box width="fit-content"
                                     key={food.id}
                                     sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControlLabel
                                        value={food.id} label={food.name}
                                        control={<Radio checked={food.id === selectedRice}/>}/>
                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                        <Typography variant="caption"
                                                    sx={{marginLeft: 4.5, marginTop: -1.5,}}>
                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                        </Typography>)}
                                </Box>))}
                        </RadioGroup>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Main Dish</Typography>
                        <RadioGroup onChange={handleSelectedMainDish}>
                            <Box width="fit-content"
                                 sx={{display: "flex", flexDirection: "column"}}>
                                <FormControlLabel
                                    label="Without Main Dish"
                                    value={-1}
                                    control={<Radio color="error" checked={selectedMainDish === -1}/>}/>
                            </Box>
                            {mainDish.map((food) => (
                                <Box width="fit-content"
                                     key={food.id}
                                     sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControlLabel
                                        value={food.id} label={food.name}
                                        control={<Radio checked={food.id === selectedMainDish}/>}/>
                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                        <Typography variant="caption"
                                                    sx={{marginLeft: 4.5, marginTop: -1.5,}}>
                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                        </Typography>)}
                                </Box>))}
                        </RadioGroup>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Side Dish</Typography>
                        <RadioGroup onChange={handleSelectedSideDish}>
                            <Box width="fit-content"
                                 sx={{display: "flex", flexDirection: "column"}}>
                                <FormControlLabel
                                    label="Without Side Dish"
                                    value={-1}
                                    control={<Radio color="error" checked={selectedSideDish === -1}/>}/>
                            </Box>
                            {sideDish.map((food) => (
                                <Box width="fit-content"
                                     key={food.id}
                                     sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControlLabel
                                        value={food.id} label={food.name}
                                        control={<Radio checked={food.id === selectedSideDish}/>}/>
                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                        <Typography variant="caption"
                                                    sx={{marginLeft: 4.5, marginTop: -1.5,}}>
                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                        </Typography>)}
                                </Box>))}
                        </RadioGroup>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Vegetable</Typography>
                        <RadioGroup onChange={handleSelectedVegetable}>
                            <Box width="fit-content"
                                 sx={{display: "flex", flexDirection: "column"}}>
                                <FormControlLabel
                                    label="Without Vegetable"
                                    value={-1}
                                    control={<Radio color="error"
                                                    checked={selectedVegetable === -1}/>}/>
                            </Box>
                            {vegetable.map((food) => (
                                <Box width="fit-content"
                                     key={food.id}
                                     sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControlLabel
                                        value={food.id} label={food.name}
                                        control={<Radio checked={food.id === selectedVegetable}/>}/>
                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                        <Typography variant="caption"
                                                    sx={{marginLeft: 4.5, marginTop: -1.5,}}>
                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                        </Typography>)}
                                </Box>))}
                        </RadioGroup>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Complementary Food</Typography>
                        <FormGroup>
                            {additional.map((food) => (
                                <Box width="fit-content"
                                     key={food.id}
                                     sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControlLabel
                                        value={food.id} label={food.name}
                                        control={<Checkbox
                                            checked={selectedAdditional.includes(food.id)}
                                            onChange={() => handleSelectedAdditional(food.id)}/>}/>
                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                        <Typography variant="caption"
                                                    sx={{marginLeft: 4.5, marginTop: -1.5,}}>
                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                        </Typography>)}
                                </Box>))}
                        </FormGroup>

                        <Typography variant="body1" sx={{paddingTop: 3, fontWeight: "bold"}}>Additional Note (Optional)</Typography>
                        <TextField placeholder="e.g. vegetables can be replaced with the main dish or side dish."
                                   multiline={true} rows={2} value={note}
                                   sx={{width: "100%", maxWidth: "500px"}}
                                   onChange={handleNote}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <StickyNote2Icon/>
                                           </InputAdornment>
                                       ),
                                   }}/>

                        <Box>
                            <Button variant="outlined" color="error"
                                    sx={{width: "100%", maxWidth: "500px", fontWeight: "bold", marginTop: 2}}
                                    onClick={handleCreateCateringOrder}>
                                Order
                            </Button>
                        </Box>

                    </Paper>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no active catering transaction.
                    </Alert>
                )}
            </>
        </HomeLayout>
    );
}
