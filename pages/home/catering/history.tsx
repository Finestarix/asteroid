import Image from "next/image";
import {SyntheticEvent, useEffect, useState} from "react";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {CopyToClipboard} from "react-copy-to-clipboard";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringPaymentType,
    CateringTransactionDetail,
    ChangeMultipleCateringTransactionDetailData,
    ViewCateringTransactionDetailData
} from "types/cateringType";
import {AlertTypeEnum} from "types/generalType";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";


export default function CateringHistoryPage() {

    const [transactions, setTransaction] = useState<CateringTransactionDetail[]>([]);
    const [totalUnpaid, setTotalUnpaid] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        const handleViewCateringTransactionHistory = async () => {
            setShowLoading(true);

            const cateringTransactionHistoryFetch = await fetch("/api/catering/getCateringTransactionHistory", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });

            const cateringTransactionHistoryData: ViewCateringTransactionDetailData = await cateringTransactionHistoryFetch.json();

            let totalUnpaidTemp = 0;
            cateringTransactionHistoryData.data.map((transaction, index) => {
                let priceTemp = 0;
                if (!transaction.onlyAdditional) {
                    priceTemp = transaction.header.basePrice;
                }
                for (const food of transaction.foods) {
                    if (food.food.additionalPrice) priceTemp += food.food.additionalPrice;
                    if (food.food.reductionPrice) priceTemp -= food.food.reductionPrice;
                }
                cateringTransactionHistoryData.data[index].subTotal = priceTemp;
                priceTemp += transaction.header.deliveryPrice;
                cateringTransactionHistoryData.data[index].total = priceTemp;
                if (transaction.paymentType === CateringPaymentType.NotPaid) {
                    totalUnpaidTemp += priceTemp;
                }
            });
            setTransaction(cateringTransactionHistoryData.data);
            setTotalUnpaid(totalUnpaidTemp);
            setShowLoading(false);
        };
        handleViewCateringTransactionHistory().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenAlertClipboard = () => {
        setTypeAlert("success");
        setMessageAlert("Successfully copied to clipboard.");
        setShowAlert(true);
    };
    const handleCloseAlert = () => setShowAlert(false);

    const handleAccordion = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) =>
        setExpanded(isExpanded ? panel : false);

    const handleChangeCateringTransactionDetail = async () => {
        setShowLoading(true);
        setShowModal(false);

        const changeCateringTransactionDetailFetch = await fetch("/api/catering/updatePendingCateringTransactionDetail", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            }
        });

        const changeCateringTransactionDetailData: ChangeMultipleCateringTransactionDetailData = await changeCateringTransactionDetailFetch.json();
        if (changeCateringTransactionDetailData.error) {
            setMessageAlert(changeCateringTransactionDetailData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
            setShowModal(true);
        } else {
            for (const transaction of transactions) {
                if (transaction.paymentType === CateringPaymentType.NotPaid) {
                    transaction.paymentType = CateringPaymentType.Pending;
                }
            }
            setMessageAlert(changeCateringTransactionDetailData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setTotalUnpaid(0);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    return (
        <HomeLayout title="Catering History">
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

                <Modal open={showModal}
                       onClose={handleCloseModal}>
                    <Paper elevation={8}
                           sx={{
                               paddingTop: 2,
                               paddingBottom: 2,
                               width: "300px",
                               display: "flex",
                               flexDirection: "column",
                               alignItems: "center",
                               justifyContent: "center",
                               position: "absolute",
                               top: "50%",
                               left: "50%",
                               transform: "translate(-50%, -50%)"
                           }}>
                        <Typography sx={{marginBottom: 1}}>
                            <b>RENALDY</b>
                        </Typography>
                        <Image src="/qr_code.png" alt="QR Code"
                               width={250} height={250}/>
                        <CopyToClipboard text="5271638231"
                                         onCopy={handleOpenAlertClipboard}>
                            <Box sx={{
                                marginTop: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer"
                            }}>
                                <Typography>
                                    <b>BCA - 5271638231</b>
                                </Typography>
                                <Typography variant="caption">
                                    (click to copy)
                                </Typography>
                            </Box>
                        </CopyToClipboard>
                        <Alert variant="outlined" severity="info"
                               sx={{margin: 1}}>
                            Click on <b>Notify Payment</b> so your payment can be checked.
                        </Alert>
                        <Button variant="contained" size="small" color="error"
                                onClick={handleChangeCateringTransactionDetail}>
                            Notify Payment
                        </Button>
                    </Paper>
                </Modal>

                {(transactions.length > 0) ? (
                    <Paper sx={{padding: 2}}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Typography>
                                Unpaid: {convertToIDR(totalUnpaid)}
                            </Typography>
                            {(totalUnpaid !== 0) && (
                                <Button size="small" variant="contained"
                                        startIcon={<AttachMoneyIcon/>}
                                        onClick={handleOpenModal}>
                                    Pay
                                </Button>)}
                        </Box>

                        <Box sx={{marginTop: 2}}>
                            {transactions.map((transaction, index) => (
                                <Accordion variant="outlined"
                                           key={transaction.id} expanded={expanded === "accordion" + index}
                                           onChange={handleAccordion("accordion" + index)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Box sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                            <Box>
                                                {convertDateGeneral(transaction.header.date)}
                                                {(!transaction.onlyAdditional) ?
                                                    <Chip variant="filled" size="small"
                                                          label="Full Set"
                                                          sx={{marginLeft: 0.5}}/> :
                                                    <Chip variant="filled" size="small"
                                                          label="Additional"
                                                          sx={{marginLeft: 0.5}}/>}
                                            </Box>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                                <Chip variant="outlined" size="small"
                                                      label={convertToIDR(transaction.total)}
                                                      sx={{marginRight: 0.5}}/>
                                                {(transaction.paymentType === CateringPaymentType.NotPaid) ?
                                                    <Tooltip title="Unpaid">
                                                        <CancelIcon color="secondary"
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
                                        </Box>
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
                                                            <TableCell>{convertToIDR(transaction.subTotal)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="right" width={100}>Delivery</TableCell>
                                                            <TableCell>{convertToIDR(transaction.header.deliveryPrice)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="right" width={100}>Total</TableCell>
                                                            <TableCell>{convertToIDR(transaction.total)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            {(transaction.note.length > 0) &&
                                                <TextField label="Note"
                                                           disabled={true} multiline={true} rows={2}
                                                           value={transaction.note}
                                                           fullWidth={true}
                                                           sx={{marginTop: 1.5}}
                                                           InputProps={{
                                                               startAdornment: (
                                                                   <InputAdornment position="start">
                                                                       <StickyNote2Icon/>
                                                                   </InputAdornment>
                                                               ),
                                                           }}/>}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Paper>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no catering transaction history.
                    </Alert>
                )}

            </>
        </HomeLayout>
    );
}