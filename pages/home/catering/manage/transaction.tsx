import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SellIcon from "@mui/icons-material/Sell";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Alert, {AlertColor} from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {CopyToClipboard} from "react-copy-to-clipboard";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringTransaction,
    ViewCateringTransactionData,
    ChangeCateringTransactionData
} from "types/cateringType";
import {AlertTypeEnum} from "types/generalType";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";


export default function ManageCateringTransactionPage() {

    const [transactions, setTransactions] = useState<CateringTransaction[]>([]);
    const [transactionCopy, setTransactionCopy] = useState<string>("");
    const [selectedDeleteTransaction, setSelectedDeleteTransaction] = useState<number>(-1);
    const [filter, setFilter] = useState<string>("");
    const [filteredTransactions, setFilteredTransactions] = useState<CateringTransaction[]>([]);
    const [date, setDate] = useState<Date | null>(new Date());
    const [minDate, setMinDate] = useState<Date>(new Date());
    const [maxDate, setMaxDate] = useState<Date>(new Date());
    const [basePrice, setBasePrice] = useState<number>(20000);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showLoadingForm, setShowLoadingForm] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<string | false>(false);

    useEffect(() => {
        const minDateTemp = new Date();
        setMinDate(minDateTemp);

        const maxDateTemp = new Date();
        maxDateTemp.setDate(maxDateTemp.getDate() + 6);
        setMaxDate(maxDateTemp);

        const handleViewCateringTransaction = async () => {
            setShowLoading(true);

            const cateringTransactionFetch = await fetch("/api/catering/getCateringTransaction", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });

            const cateringTransactionData: ViewCateringTransactionData = await cateringTransactionFetch.json();
            setTransactions(cateringTransactionData.data);
            setFilteredTransactions(cateringTransactionData.data);
            setShowLoading(false);
        };
        handleViewCateringTransaction().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeDate = (date: Date | null) => setDate(date);
    const changeBasePrice = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setBasePrice(parseInt(event.target.value));

    const handleFilterCateringTransaction = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let filteredTransactionsTemp = transactions;
        if (event.target.value.length > 0) {
            filteredTransactionsTemp = transactions.filter((transaction) =>
                convertDateGeneral(transaction.date).toLowerCase().indexOf(event.target.value) !== -1);
        }
        setFilter(event.target.value);
        setFilteredTransactions(filteredTransactionsTemp);
    };

    const handleOpenDialog = (id: number) => {
        setSelectedDeleteTransaction(id);
        setShowDialog(true);
    };
    const handleCloseDialog = () => setShowDialog(false);
    const handleCloseAlert = () => setShowAlert(false);
    const handleEnter = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleCreateCateringTransaction();
    };
    const handleAccordion = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) =>
        setExpanded(isExpanded ? panel : false);

    const handleCreateCateringTransaction = async () => {
        setShowLoadingForm(true);

        const createCateringTransactionFetch = await fetch("/api/catering/createCateringTransaction", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                date: date,
                basePrice: basePrice
            }),
        });

        const createCateringTransactionData: ChangeCateringTransactionData = await createCateringTransactionFetch.json();
        if (createCateringTransactionData.error) {
            setMessageAlert(createCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            transactions.push(createCateringTransactionData.data);
            setDate(new Date());
            setBasePrice(20000);
            setMessageAlert(createCateringTransactionData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoadingForm(false);
    };

    const handleChangeActiveCateringTransaction = async (id: number) => {
        setShowLoading(true);

        const updateActiveCateringTransactionFetch = await fetch("/api/catering/updateActiveCateringTransaction", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: id
            }),
        });

        const updateActiveCateringTransactionData: ChangeCateringTransactionData = await updateActiveCateringTransactionFetch.json();
        if (updateActiveCateringTransactionData.error) {
            setMessageAlert(updateActiveCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = transactions.findIndex((transaction) => transaction.id === id);
            transactions[updatedIndex].active = updateActiveCateringTransactionData.data.active;
            setMessageAlert(updateActiveCateringTransactionData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleChangeDeliveryCateringTransaction = async (id: number) => {
        setShowLoading(true);

        const updateDeliveryCateringTransactionFetch = await fetch("/api/catering/updateDeliveryCateringTransaction", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: id
            }),
        });

        const updateDeliveryCateringTransactionData: ChangeCateringTransactionData = await updateDeliveryCateringTransactionFetch.json();
        if (updateDeliveryCateringTransactionData.error) {
            setMessageAlert(updateDeliveryCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = transactions.findIndex((transaction) => transaction.id === id);
            transactions[updatedIndex].deliveryPrice = updateDeliveryCateringTransactionData.data.deliveryPrice;
            setMessageAlert(updateDeliveryCateringTransactionData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleDeleteCateringTransaction = async () => {
        setShowLoading(true);
        setShowDialog(false);

        const deleteCateringTransactionFetch = await fetch("/api/catering/deleteCateringTransaction", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: selectedDeleteTransaction
            }),
        });

        const deleteCateringTransactionData: ChangeCateringTransactionData = await deleteCateringTransactionFetch.json();
        if (deleteCateringTransactionData.error) {
            setMessageAlert(deleteCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const deleteIndex = transactions.findIndex((transaction) => transaction.id === selectedDeleteTransaction);
            transactions.splice(deleteIndex, 1);
            setMessageAlert(deleteCateringTransactionData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setSelectedDeleteTransaction(-1);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleCopyClipboard = (transaction: CateringTransaction) => {
        let copyTemp = "Catering " + convertDateGeneral(transaction.date) + "\n\n";

        transaction.details.forEach((detail, index) => {
            copyTemp += (index + 1) + ". " + detail.participant.username +
                ((detail.onlyAdditional) ? " (HANYA TAMBAHAN)" : "") + "\n";
            detail.foods.forEach((food) => {
                copyTemp += "- " + food.food.name + "\n";
            });
            if (detail.note) copyTemp += "Catatan: " + detail.note + "\n";
            copyTemp += "\n";
        });
        setTransactionCopy(copyTemp);
    };

    return (
        <HomeLayout title="Manage Catering Transaction">
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

                <Dialog open={showDialog}
                        onClose={handleCloseDialog}>
                    <DialogTitle>
                        Delete Transaction Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are about to delete catering transaction permanently from database. Are you sure?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text"
                                onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button color="error" variant="contained"
                                onClick={handleDeleteCateringTransaction}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper sx={{padding: 2, paddingBottom: 3, marginBottom: 2}}>

                    <Typography variant="body1">
                        Create Catering Transaction
                    </Typography>

                    <Box component="form"
                         sx={{paddingTop: 2}}>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Date" inputFormat="eeee, MMMM d" mask=""
                                        value={date} disabled={showLoadingForm} disableOpenPicker={showLoadingForm}
                                        minDate={minDate} maxDate={maxDate}
                                        onChange={changeDate}
                                        renderInput={(params) =>
                                            <TextField variant="outlined" size="medium"
                                                       fullWidth={true}
                                                       sx={{marginBottom: 2}}
                                                       {...params} />}
                            />
                        </LocalizationProvider>

                        <TextField type="number" label="Base Price" variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoadingForm} value={basePrice}
                                   sx={{marginBottom: 2}}
                                   onChange={changeBasePrice} onKeyDown={handleEnter}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">Rp.</InputAdornment>
                                       ),
                                   }}/>

                        <Box sx={{position: "relative"}}>
                            <Button variant="contained" size="large"
                                    fullWidth={true} disabled={showLoadingForm}
                                    onClick={handleCreateCateringTransaction}>
                                Create
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

                    </Box>

                </Paper>

                {(transactions.length !== 0) ? (
                    <>
                        <TextField type="text" label="Filter" variant="standard" size="medium"
                                   fullWidth={true} value={filter}
                                   sx={{marginBottom: 2}}
                                   onChange={handleFilterCateringTransaction}/>
                        {filteredTransactions
                            .map((transaction, index) => (
                                <Accordion key={transaction.id} expanded={expanded === "accordion" + index}
                                           onChange={handleAccordion("accordion" + index)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography
                                            sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                            {convertDateGeneral(transaction.date)}
                                        </Typography>
                                        <Box sx={{display: "flex"}}>
                                            <Chip variant="filled" size="small"
                                                  label={transaction.details.length + " pax"}
                                                  sx={{marginRight: 0.5}}/>
                                            {(transaction.active) ?
                                                <Tooltip title="Active">
                                                    <CheckCircleIcon color="info"
                                                                     sx={{marginRight: 2}}/>
                                                </Tooltip> :
                                                <Tooltip title="Inactive">
                                                    <CancelIcon color="primary"
                                                                sx={{marginRight: 2}}/>
                                                </Tooltip>}
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Box sx={{display: "flex"}}>
                                                <SellIcon sx={{marginRight: 1}}/>
                                                <Typography variant="body1"
                                                            sx={{marginBottom: 1}}>
                                                    {convertToIDR(transaction.basePrice)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: "flex"}}>
                                                <DeliveryDiningIcon sx={{marginRight: 1}}/>
                                                <Typography variant="body1"
                                                            sx={{marginBottom: 1}}>
                                                    {convertToIDR(transaction.deliveryPrice)}/pax
                                                    ({convertToIDR(transaction.realDeliveryPrice)})
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption">
                                                Created by <b>{transaction.createdBy.username}</b>
                                            </Typography>
                                            <Typography variant="caption">
                                                Last Updated by <b>{transaction.lastUpdatedBy.username}</b>
                                            </Typography>
                                            <List dense={true}>
                                                {transaction.details.map((detail) => (
                                                    <ListItem key={detail.id} disableGutters={true}
                                                              sx={{
                                                                  width: "100%",
                                                                  display: "flex",
                                                                  flexDirection: "column",
                                                                  alignItems: "flex-start"
                                                              }}>
                                                        <ListItemText
                                                            primary={
                                                                <Box>
                                                                    <Typography variant="overline"
                                                                                sx={{marginRight: 0.5}}>
                                                                        {detail.participant.username}&nbsp;
                                                                    </Typography>
                                                                    {(detail.onlyAdditional) ?
                                                                        <Chip variant="outlined" size="small"
                                                                              label="Full Set"/> :
                                                                        <Chip variant="outlined" size="small"
                                                                              label="Only Additional"/>}
                                                                </Box>}/>
                                                        <ListItemText
                                                            primary={
                                                                <Box>
                                                                    <Box sx={{
                                                                        width: "100%",
                                                                        display: "flex",
                                                                        flexDirection: "row"
                                                                    }}>
                                                                        <Box>
                                                                            {detail.foods.map((food) => (
                                                                                <Chip variant="filled" size="small"
                                                                                      key={food.id}
                                                                                      label={food.food.name}
                                                                                      sx={{
                                                                                          marginRight: 1,
                                                                                          marginBottom: 1
                                                                                      }}/>
                                                                            ))}
                                                                        </Box>
                                                                    </Box>
                                                                    {(detail.note) && (
                                                                        <Typography variant="caption">
                                                                            Notes: {detail.note}
                                                                        </Typography>
                                                                    )}
                                                                </Box>}/>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <ButtonGroup orientation="vertical">
                                                <CopyToClipboard text={transactionCopy}
                                                                 onCopy={() => handleCopyClipboard(transaction)}>
                                                    <Tooltip title="Copy Catering" placement="left">
                                                        <IconButton color="primary"
                                                                    disabled={showLoading}>
                                                            <ContentPasteIcon/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                                <Tooltip title="Change Status" placement="left">
                                                    <IconButton color="primary"
                                                                disabled={showLoading}
                                                                onClick={() => handleChangeActiveCateringTransaction(transaction.id)}>
                                                        <ChangeCircleIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Update Delivery Price" placement="left">
                                                    <IconButton color="primary"
                                                                disabled={showLoading}
                                                                onClick={() => handleChangeDeliveryCateringTransaction(transaction.id)}>
                                                        <LocalOfferIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Transaction" placement="left">
                                                    <IconButton color="error"
                                                                disabled={showLoading}
                                                                onClick={() => handleOpenDialog(transaction.id)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </ButtonGroup>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no catering transaction data.
                    </Alert>
                )}
            </>
        </HomeLayout>
    );
}
