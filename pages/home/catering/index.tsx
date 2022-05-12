import {useRouter} from "next/router";
import {ChangeEvent, useEffect, useState} from "react";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Alert, {AlertColor} from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringFood,
    CateringTransaction,
    ViewActiveCateringTransactionData,
    ViewOrderCateringFoodData,
    ViewTotalCateringTransactionData,
    InsertCateringTransactionDetailData,
} from "types/cateringType";
import {AlertTypeEnum} from "types/generalType";
import {calculateDeliveryPrice} from "utils/calculator";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";


export default function CateringOrderPage() {

    const [activeStep, setActiveStep] = useState<number>(-1);
    const [transaction, setTransaction] = useState<CateringTransaction>();
    const [totalTransaction, setTotalTransaction] = useState<number>(1);
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
    const [onlyAdditional, setOnlyAdditional] = useState<boolean>(false);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
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

                const totalCateringTransactionFetch = await fetch("/api/catering/getTotalCateringTransactionDetail", {
                    method: "POST",
                    headers: {
                        "authorization": decryptData(getSessionToken())
                    },
                    body: JSON.stringify({
                        id: cateringTransactionData.data.id
                    })
                });
                const totalCateringTransactionData: ViewTotalCateringTransactionData = await totalCateringTransactionFetch.json();

                setRice(cateringFoodData.data.Rice);
                setMainDish(cateringFoodData.data.MainDish);
                setSideDish(cateringFoodData.data.SideDish);
                setVegetable(cateringFoodData.data.Vegetable);
                setAdditional(cateringFoodData.data.Additional);
                setTotalTransaction(totalCateringTransactionData.data);
                setActiveStep(0);
            }
            setShowLoading(false);
        };

        handleViewCateringOrder().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const router = useRouter();
    const gotoCateringHistory = async () => await router.push("/home/catering/history");

    const handleCloseAlert = () => setShowAlert(false);

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

    const handleFullSet = () => {
        setOnlyAdditional(false);
        setActiveStep(1);
    };
    const handleOnlyAdditional = () => {
        setOnlyAdditional(true);
        setActiveStep(5);
    };
    const handleBack = () => setActiveStep((prevActiveStep) => {
        return (onlyAdditional && prevActiveStep === 5) ? 0 : prevActiveStep - 1;
    });
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const handleFinalNext = () => {

        let subTotalTemp = 0;
        if (!onlyAdditional) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            subTotalTemp = transaction.basePrice;
            for (const food of rice.filter((food) => food.id === selectedRice)) {
                if (food.additionalPrice) subTotalTemp += food.additionalPrice;
                if (food.reductionPrice) subTotalTemp -= food.reductionPrice;
            }
            for (const food of mainDish.filter((food) => food.id === selectedMainDish)) {
                if (food.additionalPrice) subTotalTemp += food.additionalPrice;
                if (food.reductionPrice) subTotalTemp -= food.reductionPrice;
            }
            for (const food of sideDish.filter((food) => food.id === selectedSideDish)) {
                if (food.additionalPrice) subTotalTemp += food.additionalPrice;
                if (food.reductionPrice) subTotalTemp -= food.reductionPrice;
            }
            for (const food of vegetable.filter((food) => food.id === selectedVegetable)) {
                if (food.additionalPrice) subTotalTemp += food.additionalPrice;
                if (food.reductionPrice) subTotalTemp -= food.reductionPrice;
            }
        }

        for (const food of (!onlyAdditional ? additional : [...rice, ...additional])
            .filter((food) => selectedAdditional.includes(food.id))) {
            if (food.additionalPrice) subTotalTemp += food.additionalPrice;
            if (food.reductionPrice) subTotalTemp -= food.reductionPrice;
        }

        setSubTotal(subTotalTemp);
        setTotal(subTotalTemp + calculateDeliveryPrice(totalTransaction));
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleCreateCateringOrder = async () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setShowLoading(true);

        const createCateringOrderFetch = await fetch("/api/catering/createCateringTransactionDetail", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                header: transaction.id,
                note: note,
                onlyAdditional: onlyAdditional,
                foods: [selectedRice, selectedMainDish, selectedSideDish, selectedVegetable,
                    ...(!onlyAdditional ? additional : [...rice, ...additional])
                        .filter((food) => selectedAdditional.includes(food.id))
                        .map((food) => food.id)]
                    .filter((food) => food != 0 && food != -1)
            }),
        });

        const createCateringOrderData: InsertCateringTransactionDetailData = await createCateringOrderFetch.json();
        if (createCateringOrderData.error) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
            setMessageAlert(createCateringOrderData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setMessageAlert(createCateringOrderData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    return (
        <HomeLayout title="Catering Order">
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

                {(transaction) ? (
                    <Paper sx={{padding: 2}}>

                        <Typography variant="h6"
                                    sx={{paddingBottom: 2}}>
                            Catering for {convertDateGeneral(transaction.date)}
                        </Typography>

                        {(transaction.details && transaction.details.length > 0) && (
                            <Alert variant="outlined" severity="info"
                                   sx={{maxWidth: "530px", marginBottom: 2}}>
                                You already have <b>{transaction.details.length} transaction</b> for this catering.
                            </Alert>
                        )}

                        <Stepper orientation="vertical"
                                 activeStep={activeStep}>

                            <Step>
                                <StepLabel>Choose Catering Type</StepLabel>
                                <StepContent>
                                    <Box>
                                        <ButtonGroup orientation="vertical" variant="outlined" size="small"
                                                     sx={{marginTop: 2}}>
                                            <Button onClick={handleFullSet}>
                                                Full Set
                                            </Button>
                                            <Button onClick={handleOnlyAdditional}>
                                                Only Complementary Food
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Choose Rice Portion</StepLabel>
                                <StepContent>
                                    <Box>
                                        <RadioGroup sx={{marginBottom: 2}}
                                                    onChange={handleSelectedRice}>
                                            <Box width="fit-content"
                                                 sx={{display: "flex", flexDirection: "column"}}>
                                                <FormControlLabel
                                                    label="Without Rice"
                                                    value={-1}
                                                    control={<Radio color="error" checked={selectedRice === -1}/>}/>
                                            </Box>
                                            {rice.map((food) => (
                                                <Box width="fit-content"
                                                     key={food.id}
                                                     sx={{display: "flex", flexDirection: "column"}}>
                                                    <FormControlLabel
                                                        value={food.id} label={food.name}
                                                        control={<Radio checked={food.id === selectedRice}/>}/>
                                                    {(food.additionalPrice !== 0 || food.reductionPrice !== 0) && (
                                                        <Typography variant="caption"
                                                                    sx={{marginLeft: 4, marginTop: -1.5,}}>
                                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                                        </Typography>)}
                                                </Box>))}
                                        </RadioGroup>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button disabled={selectedRice === 0} endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Choose Main Dish</StepLabel>
                                <StepContent>
                                    <Box>
                                        <RadioGroup sx={{marginBottom: 2}}
                                                    onChange={handleSelectedMainDish}>
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
                                                                    sx={{marginLeft: 4, marginTop: -1.5,}}>
                                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                                        </Typography>)}
                                                </Box>))}
                                        </RadioGroup>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button disabled={selectedMainDish === 0}
                                                    endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Choose Side Dish</StepLabel>
                                <StepContent>
                                    <Box>
                                        <RadioGroup sx={{marginBottom: 2}}
                                                    onChange={handleSelectedSideDish}>
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
                                                                    sx={{marginLeft: 4, marginTop: -1.5,}}>
                                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                                        </Typography>)}
                                                </Box>))}
                                        </RadioGroup>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button disabled={selectedSideDish === 0}
                                                    endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Choose Vegetable</StepLabel>
                                <StepContent>
                                    <Box>
                                        <RadioGroup sx={{marginBottom: 2}}
                                                    onChange={handleSelectedVegetable}>
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
                                                                    sx={{marginLeft: 4, marginTop: -1.5,}}>
                                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                                        </Typography>)}
                                                </Box>))}
                                        </RadioGroup>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button disabled={selectedVegetable === 0}
                                                    endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Add Complementary Food</StepLabel>
                                <StepContent>
                                    <Box>
                                        <FormGroup sx={{marginBottom: 2}}>
                                            {(!onlyAdditional ? additional : [...rice, ...additional]).map((food) => (
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
                                                                    sx={{marginLeft: 4, marginTop: -1.5,}}>
                                                            {(food.additionalPrice !== 0) ? " (+ " + convertToIDR(food.additionalPrice) + ")" :
                                                                (food.reductionPrice !== 0) ? " (- " + convertToIDR(food.reductionPrice) + ")" : ""}
                                                        </Typography>)}
                                                </Box>))}
                                        </FormGroup>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button endIcon={<ArrowRightIcon/>}
                                                    onClick={handleFinalNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>Give Additional Note</StepLabel>
                                <StepContent>
                                    <Box>
                                        <Box>
                                            <TextField label="Note (Optional)"
                                                       placeholder="e.g. vegetables can be replaced with the main dish or side dish."
                                                       multiline={true} rows={3} value={note}
                                                       sx={{width: "500px", marginTop: 2, marginBottom: 2}}
                                                       onChange={handleNote}
                                                       InputProps={{
                                                           startAdornment: (
                                                               <InputAdornment position="start">
                                                                   <StickyNote2Icon/>
                                                               </InputAdornment>
                                                           ),
                                                       }}/>
                                        </Box>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>
                                    Check Your Order Details
                                </StepLabel>
                                <StepContent>
                                    <Box>
                                        <TableContainer
                                            sx={{maxWidth: "500px", marginBottom: 2, whiteSpace: "nowrap"}}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>Details</TableCell>
                                                        <TableCell width={150}>Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(!onlyAdditional) && (
                                                        <>
                                                            <TableRow>
                                                                <TableCell colSpan={2}>Catering</TableCell>
                                                                <TableCell>{convertToIDR(transaction.basePrice)}</TableCell>
                                                            </TableRow>
                                                            {rice.filter((food) => food.id === selectedRice).map((food) => (
                                                                <TableRow key={food.id}>
                                                                    <TableCell colSpan={2}>{food.name}</TableCell>
                                                                    <TableCell>
                                                                        {(food.additionalPrice !== 0) ? convertToIDR(food.additionalPrice) :
                                                                            (food.reductionPrice !== 0) ? "(" + convertToIDR(food.reductionPrice) + ")" :
                                                                                convertToIDR(0)}
                                                                    </TableCell>
                                                                </TableRow>))}
                                                            {mainDish.filter((food) => food.id === selectedMainDish).map((food) => (
                                                                <TableRow key={food.id}>
                                                                    <TableCell colSpan={2}>{food.name}</TableCell>
                                                                    <TableCell>
                                                                        {(food.additionalPrice !== 0) ? convertToIDR(food.additionalPrice) :
                                                                            (food.reductionPrice !== 0) ? "(" + convertToIDR(food.reductionPrice) + ")" :
                                                                                convertToIDR(0)}
                                                                    </TableCell>
                                                                </TableRow>))}
                                                            {sideDish.filter((food) => food.id === selectedSideDish).map((food) => (
                                                                <TableRow key={food.id}>
                                                                    <TableCell colSpan={2}>{food.name}</TableCell>
                                                                    <TableCell>
                                                                        {(food.additionalPrice !== 0) ? convertToIDR(food.additionalPrice) :
                                                                            (food.reductionPrice !== 0) ? "(" + convertToIDR(food.reductionPrice) + ")" :
                                                                                convertToIDR(0)}
                                                                    </TableCell>
                                                                </TableRow>))}
                                                            {vegetable.filter((food) => food.id === selectedVegetable).map((food) => (
                                                                <TableRow key={food.id}>
                                                                    <TableCell colSpan={2}>{food.name}</TableCell>
                                                                    <TableCell>
                                                                        {(food.additionalPrice !== 0) ? convertToIDR(food.additionalPrice) :
                                                                            (food.reductionPrice !== 0) ? "(" + convertToIDR(food.reductionPrice) + ")" :
                                                                                convertToIDR(0)}
                                                                    </TableCell>
                                                                </TableRow>))}
                                                        </>
                                                    )}
                                                    {(!onlyAdditional ? additional : [...rice, ...additional])
                                                        .filter((food) => selectedAdditional.includes(food.id)).map((food) => (
                                                            <TableRow key={food.id}>
                                                                <TableCell colSpan={2}>{food.name}</TableCell>
                                                                <TableCell>
                                                                    {(food.additionalPrice !== 0) ? convertToIDR(food.additionalPrice) :
                                                                        (food.reductionPrice !== 0) ? "(" + convertToIDR(food.reductionPrice) + ")" :
                                                                            convertToIDR(0)}
                                                                </TableCell>
                                                            </TableRow>))}
                                                    <TableRow>
                                                        <TableCell rowSpan={3}/>
                                                        <TableCell align="right" width={100}>
                                                            Sub-Total
                                                        </TableCell>
                                                        <TableCell>{convertToIDR(subTotal)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="right" width={100}>
                                                            Delivery (Approx.)
                                                        </TableCell>
                                                        <TableCell>{convertToIDR(calculateDeliveryPrice(totalTransaction))}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="right" width={100}>
                                                            Total (Approx.)
                                                        </TableCell>
                                                        <TableCell>{convertToIDR(total)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Alert variant="outlined" severity="info"
                                               sx={{maxWidth: "500px", marginBottom: 2}}>
                                            Delivery price may change according to the number of order.
                                        </Alert>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button endIcon={<ArrowRightIcon/>}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>
                                    Order Catering
                                </StepLabel>
                                <StepContent>
                                    <Box>
                                        <Alert variant="outlined" severity="info"
                                               sx={{maxWidth: "500px", marginBottom: 2}}>
                                            Once you press the <b>ORDER</b> button, the transaction cannot be
                                            canceled.
                                        </Alert>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button startIcon={<ArrowLeftIcon/>}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            <Button variant="contained" endIcon={<ArrowRightIcon/>}
                                                    onClick={handleCreateCateringOrder}>
                                                Order
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>
                                    Waiting Ordering Catering
                                </StepLabel>
                                <StepContent>
                                    <Box>
                                        <Alert variant="outlined" severity="info"
                                               sx={{maxWidth: "500px", marginBottom: 2}}>
                                            Please wait. Do not <b>close</b> or <b>refresh</b> your browser. This might take several minutes.
                                        </Alert>
                                    </Box>
                                </StepContent>
                            </Step>

                            <Step>
                                <StepLabel>
                                    Check Catering History
                                </StepLabel>
                                <StepContent>
                                    <Box>
                                        <Alert variant="outlined" severity="info"
                                               sx={{maxWidth: "500px", marginBottom: 2}}>
                                            Payment is made when you have received the catering. It is recommended to pay per week to simplify the checking process.
                                        </Alert>
                                        <ButtonGroup variant="outlined" size="small">
                                            <Button onClick={gotoCateringHistory}>
                                                Check
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                </StepContent>
                            </Step>

                        </Stepper>

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
