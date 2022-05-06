import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import Alert, {AlertColor} from "@mui/material/Alert";
import {alpha} from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringTransaction,
    ViewCateringTransactionData,
    ChangeCateringTransactionData,
    DeleteCateringTransactionData
} from "types/cateringType";
import {AlertTypeEnum, OrderTypeEnum, TableHeadKey} from "types/generalType";
import {getComparator} from "utils/comparator";
import {convertDateGeneral} from "utils/date";
import {convertToIDR} from "utils/currency";
import {getSessionToken} from "utils/storage";


export default function ManageCateringTransactionPage() {

    const transactionTableHeader: TableHeadKey[] = [
        {id: "active", label: "Active?"},
        {id: "date", label: "Transaction Date"},
        {id: "basePrice", label: "Base Price"},
        {id: "deliveryPrice", label: "Delivery Price"},
        {id: "createdBy", label: "Created By"},
        {id: "lastUpdatedBy", label: "Last Updated By"}
    ];

    const [transactions, setTransactions] = useState<CateringTransaction[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [filteredTransactions, setFilteredTransactions] = useState<CateringTransaction[]>([]);
    const [date, setDate] = useState<Date | null>(new Date());
    const [basePrice, setBasePrice] = useState<number>(20000);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showLoadingForm, setShowLoadingForm] = useState<boolean>(false);
    const [orderType, setOrderType] = useState<OrderTypeEnum>(OrderTypeEnum.ASC);
    const [orderBy, setOrderBy] = useState<keyof CateringTransaction>("id");
    const [page, setPage] = useState<number>(0);
    const [dataPerPage, setDataPerPage] = useState<number>(10);

    useEffect(() => {
        const handleViewCateringTransaction = async () => {
            setShowLoading(true);

            const cateringTransactionFetch = await fetch("http://localhost:3000/api/catering/getCateringTransaction", {
                method: "POST",
                headers: {
                    "authorization": getSessionToken()
                }
            });

            const cateringTransactionData: ViewCateringTransactionData = await cateringTransactionFetch.json();
            setTransactions(cateringTransactionData.data);
            setFilteredTransactions(cateringTransactionData.data);
            setShowLoading(false);
        };
        handleViewCateringTransaction().then();
    }, []);

    const changeDate = (date: Date | null) => setDate(date);
    const changeBasePrice = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setBasePrice(parseInt(event.target.value));

    const handleFilterCateringTransaction = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let filteredTransactions = transactions;
        if (event.target.value.length > 0) {
            filteredTransactions = transactions.filter((transaction) =>
                convertDateGeneral(transaction.date).toLowerCase().indexOf(event.target.value) !== -1 ||
                transaction.basePrice.toString().indexOf(event.target.value) !== -1);
        }

        setPage(0);
        setFilter(event.target.value);
        setFilteredTransactions(filteredTransactions);
    };

    const handleOpenDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);
    const handleCloseAlert = () => setShowAlert(false);
    const handleEnter = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleCreateCateringTransaction();
    };

    const isDataSelected = (id: number) => selectedTransactions.indexOf(id) !== -1;
    const getFirstDataInPage = () => page * dataPerPage;
    const getLastDataInPage = () => getFirstDataInPage() + dataPerPage;
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeDataPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setDataPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property: keyof CateringTransaction) => () => {
        const isAscending = (orderBy === property && orderType === OrderTypeEnum.ASC);
        setOrderType(isAscending ? OrderTypeEnum.DESC : OrderTypeEnum.ASC);
        setOrderBy(property);
    };

    const handleSelectClick = (id: number) => {
        const selectedIndex = selectedTransactions.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedTransactions, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedTransactions.slice(1));
        } else if (selectedIndex === selectedTransactions.length - 1) {
            newSelected = newSelected.concat(selectedTransactions.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selectedTransactions.slice(0, selectedIndex), selectedTransactions.slice(selectedIndex + 1));
        }
        setSelectedTransactions(newSelected);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
        (event.target.checked) ?
            setSelectedTransactions(transactions.map((transaction) => transaction.id)) :
            setSelectedTransactions([]);

    const handleCreateCateringTransaction = async () => {
        setShowLoadingForm(true);

        const createCateringTransactionFetch = await fetch("http://localhost:3000/api/catering/createCateringTransaction", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
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

        const updateActiveCateringTransactionFetch = await fetch("http://localhost:3000/api/catering/updateActiveCateringTransaction", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
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

    const handleDeleteCateringTransaction = async () => {
        setShowLoading(true);
        setShowDialog(false);

        const deleteCateringTransactionFetch = await fetch("http://localhost:3000/api/catering/deleteMultipleCateringTransaction", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
            },
            body: JSON.stringify({
                ids: selectedTransactions
            }),
        });

        const deleteCateringTransactionData: DeleteCateringTransactionData = await deleteCateringTransactionFetch.json();
        if (deleteCateringTransactionData.error) {
            setMessageAlert(deleteCateringTransactionData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            selectedTransactions.forEach((data) => {
                const deleteIndex = transactions.findIndex((transaction) => transaction.id === data);
                transactions.splice(deleteIndex, 1);
            });
            setMessageAlert(deleteCateringTransactionData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setSelectedTransactions([]);
        }
        setShowAlert(true);
        setShowLoading(false);
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

                <Snackbar open={showAlert} autoHideDuration={5000} anchorOrigin={{vertical: "top", horizontal: "right"}}
                          onClose={handleCloseAlert}>
                    <Alert severity={typeAlert}
                           onClose={handleCloseAlert}>
                        {messageAlert}
                    </Alert>
                </Snackbar>

                <Dialog open={showDialog}
                        onClose={handleCloseDialog}>
                    <DialogTitle>
                        Delete Transaction(s) Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are about to delete catering transaction(s) permanently from database. Are you sure?
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

                    <Typography variant="h6">
                        Create Catering Transaction
                    </Typography>

                    <Box component="form"
                         sx={{paddingTop: 2}}>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Date" inputFormat="eeee, MMMM d" mask=""
                                        value={date} disabled={showLoadingForm} disableOpenPicker={showLoadingForm}
                                        minDate={new Date()}
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

                        <Paper>

                            <Toolbar variant="dense"
                                     sx={{
                                         paddingLeft: {sm: 2}, paddingRight: {xs: 1, sm: 1},
                                         ...(selectedTransactions.length > 0 && {
                                             bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                                         })
                                     }}>
                                {selectedTransactions.length > 0 ?
                                    <Typography sx={{flex: "1 1 100%"}}>{selectedTransactions.length} selected</Typography> :
                                    <Typography sx={{flex: "1 1 100%"}}>Transactions</Typography>}
                                {selectedTransactions.length > 0 &&
                                    <Tooltip title="Delete">
                                        <IconButton onClick={handleOpenDialog}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>}
                            </Toolbar>

                            <TableContainer>
                                <Table size="medium" sx={{whiteSpace: "nowrap"}}>

                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox color="primary"
                                                          disabled={showLoading}
                                                          indeterminate={selectedTransactions.length > 0 && selectedTransactions.length < filteredTransactions.length}
                                                          checked={filteredTransactions.length > 0 && selectedTransactions.length === filteredTransactions.length}
                                                          onChange={handleSelectAllClick}/>
                                            </TableCell>
                                            {transactionTableHeader.map((tableHeader) => (
                                                <TableCell key={tableHeader.id}
                                                           sortDirection={orderBy === tableHeader.id ? orderType : false}>
                                                    <TableSortLabel active={orderBy === tableHeader.id}
                                                                    direction={orderBy === tableHeader.id ? orderType : OrderTypeEnum.ASC}
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                                    onClick={handleRequestSort(tableHeader.id)}>
                                                        {tableHeader.label}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredTransactions
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            .sort(getComparator(orderType, orderBy))
                                            .slice(getFirstDataInPage(), getLastDataInPage())
                                            .map((transaction, _) => {
                                                const isItemSelected = isDataSelected(transaction.id);
                                                return (
                                                    // TODO: Add Catering Transaction Detail
                                                    <TableRow key={transaction.id} tabIndex={-1} hover={!showLoading}
                                                              selected={isItemSelected}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox disabled={showLoading} checked={isItemSelected}
                                                                      onChange={() => handleSelectClick(transaction.id)}/>
                                                        </TableCell>
                                                        <TableCell width={100} sx={{paddingTop: 0, paddingBottom: 0}}>
                                                            <Tooltip
                                                                title={(transaction.active) ? "Set to Inactive" : "Set to Active"}>
                                                                <Switch disabled={showLoading} checked={transaction.active}
                                                                        onChange={() => handleChangeActiveCateringTransaction(transaction.id)}/>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            {convertDateGeneral(transaction.date)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {convertToIDR(transaction.basePrice)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {convertToIDR(transaction.deliveryPrice)}
                                                        </TableCell>
                                                        <TableCell width={150}>
                                                            {(transaction.createdBy.fullname) ? transaction.createdBy.fullname : transaction.createdBy.username}
                                                        </TableCell>
                                                        <TableCell width={150}>
                                                            {(transaction.lastUpdatedBy.fullname) ? transaction.lastUpdatedBy.fullname : transaction.lastUpdatedBy.username}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {((page > 0) ? Math.max(0, (1 + page) * dataPerPage - filteredTransactions.length) : 0) > 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6}/>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" rowsPerPageOptions={[5, 10, 15, 20]}
                                             count={filteredTransactions.length} page={page} rowsPerPage={dataPerPage}
                                             onPageChange={handleChangePage}
                                             onRowsPerPageChange={handleChangeDataPerPage}/>

                        </Paper>
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
