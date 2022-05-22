import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert, {AlertColor} from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";

import HomeLayout from "@components/layout/HomeLayout";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";
import {
    CateringPaymentType,
    CateringTransactionDetail,
    ViewCateringTransactionDetailData
} from "types/cateringType";
import MenuItem from "@mui/material/MenuItem";


export default function ManageCateringPaymentPage() {

    const [transactions, setTransactions] = useState<CateringTransactionDetail[]>([]);
    const [paymentType, setPaymentType] = useState<CateringPaymentType | string>("All");
    const [subTotal, setSubTotal] = useState<number[]>([]);
    const [total, setTotal] = useState<number[]>([]);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        const handleViewCateringFood = async () => {
            setShowLoading(true);

            const cateringTransactionFetch = await fetch("/api/catering/getNotDoneCateringTransaction", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });

            const cateringTransactionData: ViewCateringTransactionDetailData = await cateringTransactionFetch.json();
            setTransactions(cateringTransactionData.data);

            const subTotalTemp = [];
            const totalTemp = [];
            for (const transaction of cateringTransactionData.data) {
                let priceTemp = 0;

                if (!transaction.onlyAdditional) {
                    priceTemp = transaction.header.basePrice;
                }

                for (const food of transaction.foods) {
                    if (food.food.additionalPrice) priceTemp += food.food.additionalPrice;
                    if (food.food.reductionPrice) priceTemp -= food.food.reductionPrice;
                }
                subTotalTemp.push(priceTemp);
                priceTemp += transaction.header.deliveryPrice;
                totalTemp.push(priceTemp);
            }
            setSubTotal(subTotalTemp);
            setTotal(totalTemp);

            setShowLoading(false);
        };
        handleViewCateringFood().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changePaymentType = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPaymentType(event.target.value);

    const handleCloseAlert = () => setShowAlert(false);

    const handleAccordion = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) =>
        setExpanded(isExpanded ? panel : false);

    return (
        <HomeLayout title="Manage Payment">
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

                {(transactions.length > 0) ? (
                    <>
                        <TextField select label="Payment Status" variant="standard" size="medium"
                                   fullWidth={true} disabled={showLoading} value={paymentType}
                                   sx={{marginBottom: 2}}
                                   onChange={changePaymentType}>
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value={CateringPaymentType.Pending}>{CateringPaymentType.Pending}</MenuItem>
                            <MenuItem value={CateringPaymentType.NotPaid}>{CateringPaymentType.NotPaid}</MenuItem>
                        </TextField>

                        {transactions
                            .filter((transactions) => (paymentType !== "All") ? transactions.paymentType === paymentType : true)
                            .map((transaction, index) => (
                                <Accordion key={transaction.id} expanded={expanded === "accordion" + index}
                                           onChange={handleAccordion("accordion" + index)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography
                                            sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                            <Box>
                                                {convertDateGeneral(transaction.header.date)}&nbsp;
                                                <Chip variant="filled" size="small"
                                                      label={(transaction.participant.alias) ? transaction.participant.alias : transaction.participant.username}
                                                      sx={{marginLeft: 0.5}}/>
                                            </Box>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                                <Chip variant="outlined" size="small"
                                                      label={convertToIDR(total[index])}
                                                      sx={{marginRight: 0.5}}/>
                                                {(transaction.paymentType === CateringPaymentType.NotPaid) ?
                                                    <Tooltip title="Unpaid">
                                                        <CancelIcon color="error"
                                                                    sx={{marginRight: 2}}/>
                                                    </Tooltip> : (transaction.paymentType === CateringPaymentType.Paid) ?
                                                        <Tooltip title="Paid">
                                                            <CheckCircleIcon color="disabled"
                                                                             sx={{marginRight: 2}}/>
                                                        </Tooltip> :
                                                        <Tooltip title="Pending">
                                                            <RemoveCircleIcon color="primary"
                                                                              sx={{marginRight: 2}}/>
                                                        </Tooltip>}
                                            </Box>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <TableContainer sx={{marginBottom: 1, whiteSpace: "nowrap"}}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>Details</TableCell>
                                                            <TableCell width={150}>Price</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(!transaction.onlyAdditional) && (
                                                            <TableRow>
                                                                <TableCell colSpan={2}>Catering</TableCell>
                                                                <TableCell>{convertToIDR(transaction.header.basePrice)}</TableCell>
                                                            </TableRow>)}
                                                        {transaction.foods.map((food) => (
                                                            <TableRow key={food.id}>
                                                                <TableCell colSpan={2}>{food.food.name}</TableCell>
                                                                <TableCell>
                                                                    {(food.food.additionalPrice !== 0) ? convertToIDR(food.food.additionalPrice) :
                                                                        (food.food.reductionPrice !== 0) ? "(" + convertToIDR(food.food.reductionPrice) + ")" :
                                                                            convertToIDR(0)}
                                                                </TableCell>
                                                            </TableRow>))}
                                                        <TableRow>
                                                            <TableCell rowSpan={3}/>
                                                            <TableCell align="right" width={100}>Sub-Total</TableCell>
                                                            <TableCell>{convertToIDR(subTotal[index])}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="right" width={100}>Delivery</TableCell>
                                                            <TableCell>{convertToIDR(transaction.header.deliveryPrice)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="right" width={100}>Total</TableCell>
                                                            <TableCell>{convertToIDR(total[index])}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no catering transaction history.
                    </Alert>
                )}

            </>
        </HomeLayout>
    );
}
