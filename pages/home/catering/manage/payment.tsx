import Image from "next/image";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert, {AlertColor} from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
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
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {CopyToClipboard} from "react-copy-to-clipboard";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringTransaction,
    CateringTransactionDetail,
    CateringPaymentType,
    ViewCateringTransactionData,
    ViewCateringTransactionDetailData,
    ChangeMultipleCateringTransactionDetailData
} from "types/cateringType";
import {AlertTypeEnum} from "types/generalType";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";


export default function ManageCateringPaymentPage() {

    const [transactions, setTransactions] = useState<CateringTransactionDetail[]>([]);
    const [rangeTransactions, setRangeTransactions] = useState<CateringTransaction[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
    const [aliasUsername, setAliasUsername] = useState<string>("");
    const [paymentType, setPaymentType] = useState<CateringPaymentType | string>("All");
    const [minDate, setMinDate] = useState<Date | undefined>(new Date());
    const [maxDate, setMaxDate] = useState<Date | undefined>(new Date());
    const [totalUnpaid, setTotalUnpaid] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showLoadingForm, setShowLoadingForm] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
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

            let totalUnpaidTemp = 0;
            const selectedTransaction: number[] = [];
            cateringTransactionData.data.map((transaction, index) => {
                let priceTemp = 0;
                if (!transaction.onlyAdditional) {
                    priceTemp = transaction.header.basePrice;
                }
                for (const food of transaction.foods) {
                    if (food.food.additionalPrice) priceTemp += food.food.additionalPrice;
                    if (food.food.reductionPrice) priceTemp -= food.food.reductionPrice;
                }
                cateringTransactionData.data[index].subTotal = priceTemp;
                priceTemp += transaction.header.deliveryPrice;
                cateringTransactionData.data[index].total = priceTemp;
                totalUnpaidTemp += priceTemp;
                selectedTransaction.push(transaction.id);
            });
            setTransactions(cateringTransactionData.data);
            setSelectedTransactions(selectedTransaction);
            setTotalUnpaid(totalUnpaidTemp);

            setShowLoading(false);
        };
        handleViewCateringFood().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeAliasUsername = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setAliasUsername(event.target.value);
        handleRefreshUnpaid(event.target.value, "aliasUsername", false);
    };
    const changePaymentType = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPaymentType(event.target.value);
        handleRefreshUnpaid(event.target.value, "paymentType", false);
    };
    const changeMinDate = (date: Date | null) => setMinDate((date) ? date : undefined);
    const changeMaxDate = (date: Date | null) => setMaxDate((date) ? date : undefined);

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

    const handleViewRangeDateCateringTransaction = async () => {
        setShowLoadingForm(true);

        const viewRangeDateCateringTransactionFetch = await fetch("/api/catering/getRangeDateCateringTransaction", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                startDate: minDate,
                endDate: maxDate
            })
        });

        const viewRangeDateCateringTransactionData: ViewCateringTransactionData = await viewRangeDateCateringTransactionFetch.json();
        if (viewRangeDateCateringTransactionData.error) {
            setMessageAlert(viewRangeDateCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
            setShowAlert(true);
        } else {
            setRangeTransactions(viewRangeDateCateringTransactionData.data);
            viewRangeDateCateringTransactionData.data.map((transaction, index1) => {
                let priceTransactionTemp = 0;
                transaction.details.map((detail,index2) => {
                    let priceTemp = 0;
                    if (!detail.onlyAdditional) {
                        priceTemp = transaction.basePrice;
                    }
                    for (const food of detail.foods) {
                        if (food.food.additionalPrice) priceTemp += food.food.additionalPrice;
                        if (food.food.reductionPrice) priceTemp -= food.food.reductionPrice;
                    }
                    viewRangeDateCateringTransactionData.data[index1].details[index2].subTotal = priceTemp;
                    priceTemp += transaction.deliveryPrice;
                    viewRangeDateCateringTransactionData.data[index1].details[index2].total = priceTemp;
                    priceTransactionTemp += priceTemp;
                });
                viewRangeDateCateringTransactionData.data[index1].total = priceTransactionTemp;
            });
        }
        setShowLoadingForm(false);
    };

    const handleRefreshUnpaid = (value: string, key: string, notCheck: boolean) => {
        const detail = (!notCheck) ? (transactions
                .filter((transaction) =>
                    transaction.participant.username.toLowerCase().includes(((key === "aliasUsername") ? value : aliasUsername).toLowerCase()) ||
                    ((transaction.participant.alias) ? transaction.participant.alias.toLowerCase().includes(((key === "aliasUsername") ? value : aliasUsername).toLowerCase()) : false))
                .filter((transaction) =>
                    (((key === "paymentType") ? value : paymentType) !== "All") ? transaction.paymentType === value : true)) :
            transactions;

        let totalUnpaidTemp = 0;
        const selectedTransaction = [];
        for (const transaction of detail) {
            selectedTransaction.push(transaction.id);
            totalUnpaidTemp += transaction.total;
        }
        setSelectedTransactions(selectedTransaction);
        setTotalUnpaid(totalUnpaidTemp);
    };

    const handleChangeCateringTransactionDetail = async (selectedID: number) => {
        setShowLoading(true);
        setShowModal(false);

        const changeCateringTransactionDetailFetch = await fetch("/api/catering/updatePaidCateringTransactionDetail", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                ids: (selectedID === 0) ? selectedTransactions : [selectedID]
            })
        });

        const changeCateringTransactionDetailData: ChangeMultipleCateringTransactionDetailData = await changeCateringTransactionDetailFetch.json();
        if (changeCateringTransactionDetailData.error) {
            setMessageAlert(changeCateringTransactionDetailData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
            setShowModal(true);
        } else {
            if (selectedID === 0) {
                for (const selectedTransaction of selectedTransactions) {
                    const deleteIndex = transactions.findIndex((transaction) => transaction.id === selectedTransaction);
                    transactions.splice(deleteIndex, 1);
                }
            } else {
                const deleteIndex = transactions.findIndex((transaction) => transaction.id === selectedID);
                transactions.splice(deleteIndex, 1);
            }
            setMessageAlert(changeCateringTransactionDetailData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setTotalUnpaid(0);
        }
        setPaymentType("All");
        setAliasUsername("");
        handleRefreshUnpaid("", "", true);
        setShowAlert(true);
        setShowLoading(false);
    };

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
                        <Image src="/qr_code.jpg" alt="QR Code"
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
                        <Button variant="contained" size="small" color="error"
                                sx={{marginTop: 1}}
                                onClick={() => handleChangeCateringTransactionDetail(0)}>
                            Approve Payment
                        </Button>
                    </Paper>
                </Modal>

                {(transactions.length > 0) ? (
                    <Paper sx={{padding: 2}}>

                        <Typography variant="body1">
                            Not Paid or Pending Payment
                        </Typography>

                        <Box sx={{paddingTop: 1}}>
                            <TextField type="text" label="Initial" variant="standard" size="medium"
                                       fullWidth={true} disabled={showLoading} value={aliasUsername}
                                       sx={{marginBottom: 2}}
                                       onChange={changeAliasUsername}/>
                            <TextField select label="Payment Status" variant="standard" size="medium"
                                       fullWidth={true} disabled={showLoading} value={paymentType}
                                       sx={{marginBottom: 2}}
                                       onChange={changePaymentType}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value={CateringPaymentType.Pending}>{CateringPaymentType.Pending}</MenuItem>
                                <MenuItem value={CateringPaymentType.NotPaid}>{CateringPaymentType.NotPaid}</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{
                            marginBottom: 2,
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

                        {transactions
                            .filter((transaction) =>
                                transaction.participant.username.toLowerCase().includes(aliasUsername.toLowerCase()) ||
                                ((transaction.participant.alias) ? transaction.participant.alias.toLowerCase().includes(aliasUsername.toLowerCase()) : false))
                            .filter((transaction) => (paymentType !== "All") ? transaction.paymentType === paymentType : true)
                            .map((transaction) => (
                                <Card key={transaction.id} variant="outlined"
                                      sx={{
                                          paddingTop: 1,
                                          paddingBottom: 1,
                                          paddingRight: 2,
                                          paddingLeft: 2,
                                          marginBottom: 0.5
                                      }}>
                                    <Box sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                        <Box>
                                            <Typography variant="overline">
                                                {convertDateGeneral(transaction.header.date)}&nbsp;
                                            </Typography>
                                            <Chip variant="filled" size="small"
                                                  label={(transaction.participant.alias) ? transaction.participant.alias : transaction.participant.username}
                                                  sx={{marginLeft: 0.5}}/>
                                        </Box>
                                        <Box sx={{display: "flex", alignItems: "center"}}>
                                            <Chip variant="outlined" size="small"
                                                  label={convertToIDR(transaction.total)}
                                                  sx={{marginRight: 0.5}}/>
                                            {(transaction.paymentType === CateringPaymentType.NotPaid) ?
                                                <Tooltip title="Unpaid">
                                                    <CancelIcon color="secondary"/>
                                                </Tooltip> : (transaction.paymentType === CateringPaymentType.Paid) ?
                                                    <Tooltip title="Paid">
                                                        <CheckCircleIcon color="disabled"/>
                                                    </Tooltip> :
                                                    <Tooltip title="Pending">
                                                        <RemoveCircleIcon color="primary"/>
                                                    </Tooltip>}
                                            <IconButton color="error" size="small"
                                                        sx={{marginLeft: 0.5}}
                                                        onClick={() => handleChangeCateringTransactionDetail(transaction.id)}>
                                                <DoneAllIcon/>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            ))}
                    </Paper>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no pending or not paid catering transaction payment.
                    </Alert>
                )}

                <Paper component="form"
                       sx={{marginTop: 2, padding: 2}}>

                    <Typography variant="body1">
                        View Range Transaction
                    </Typography>

                    <Box sx={{marginTop: 2, marginBottom: 2, display: "flex", flexDirection: "row"}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Min Date" inputFormat="eeee, MMMM d" mask=""
                                        value={minDate} disabled={showLoadingForm} disableOpenPicker={showLoadingForm}
                                        maxDate={new Date()}
                                        onChange={changeMinDate}
                                        renderInput={(params) =>
                                            <TextField variant="outlined" size="medium"
                                                       fullWidth={true}
                                                       sx={{marginRight: 1}}
                                                       {...params} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Max Date" inputFormat="eeee, MMMM d" mask=""
                                        value={maxDate} disabled={showLoadingForm} disableOpenPicker={showLoadingForm}
                                        minDate={minDate} maxDate={new Date()}
                                        onChange={changeMaxDate}
                                        renderInput={(params) =>
                                            <TextField variant="outlined" size="medium"
                                                       fullWidth={true}
                                                       sx={{marginLeft: 1}}
                                                       {...params} />}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{position: "relative"}}>
                        <Button variant="contained" size="large"
                                fullWidth={true} disabled={showLoadingForm}
                                onClick={handleViewRangeDateCateringTransaction}>
                            View
                        </Button>
                        {showLoadingForm && (
                            <CircularProgress size={24}
                                              sx={{
                                                  position: "absolute",
                                                  top: "50%",
                                                  left: "50%",
                                                  marginTop: "-12px",
                                                  marginLeft: "-12px"
                                              }}/>)}
                    </Box>

                    <Box sx={{marginTop: 2}}>
                        {rangeTransactions.map((transaction, index) => (
                            <Accordion variant="outlined"
                                       key={transaction.id} expanded={expanded === "accordion" + index}
                                       sx={{marginBottom: 0.5}}
                                       onChange={handleAccordion("accordion" + index)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Box sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                        <Box>
                                            {convertDateGeneral(transaction.date)}
                                        </Box>
                                        <Box sx={{display: "flex", alignItems: "center"}}>
                                            <Chip variant="outlined" size="small"
                                                  label={convertToIDR(transaction.total)}
                                                  sx={{marginRight: 0.5}}/>
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box>
                                        <TableContainer sx={{marginBottom: 1, whiteSpace: "nowrap"}}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Participant</TableCell>
                                                        <TableCell width={150}>Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {transaction.details
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        .map((detail) => (
                                                            <TableRow key={detail.id} tabIndex={-1}
                                                                      hover={!showLoading}>
                                                                <TableCell>
                                                                    {(detail.participant.alias) ? detail.participant.alias : detail.participant.username}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {convertToIDR(detail.subTotal)}
                                                                </TableCell>
                                                            </TableRow>))}
                                                    <TableRow>
                                                        <TableCell/>
                                                        <TableCell>
                                                            <Typography variant="body1" color="primary">
                                                                {convertToIDR(transaction.total - (transaction.deliveryPrice * transaction.details.length))}
                                                            </Typography>
                                                            <Typography variant="body1" color="secondary">
                                                                (+{convertToIDR(transaction.deliveryPrice * transaction.details.length)})
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                </Paper>

            </>
        </HomeLayout>
    );
}
