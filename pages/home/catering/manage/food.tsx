import {useRouter} from "next/router";
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
import MenuItem from "@mui/material/MenuItem";
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

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringFood,
    CateringFoodCategory,
    ViewCateringFoodData,
    ChangeCateringFoodData,
    DeleteCateringFoodData
} from "types/cateringType";
import {AlertTypeEnum, OrderTypeEnum, TableHeadKey} from "types/generalType";
import {getComparator} from "utils/comparator";
import {convertToIDR} from "utils/currency";
import {getSessionToken} from "utils/storage";


export default function ManageCateringFoodPage() {

    const router = useRouter();

    const foodTableHeader: TableHeadKey[] = [
        {id: "active", label: "Active?"},
        {id: "name", label: "Name"},
        {id: "additionalPrice", label: "Additional Price"},
        {id: "reductionPrice", label: "Reduction Price"},
        {id: "category", label: "Category"},
        {id: "createdBy", label: "Created By"},
        {id: "lastUpdatedBy", label: "Last Updated By"}
    ];

    const [foods, setFoods] = useState<CateringFood[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<number[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [filteredFoods, setFilteredFoods] = useState<CateringFood[]>([]);
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<CateringFoodCategory | string>("");
    const [additionalPrice, setAdditionalPrice] = useState<number>(0);
    const [reductionPrice, setReductionPrice] = useState<number>(0);
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showLoadingForm, setShowLoadingForm] = useState<boolean>(false);
    const [orderType, setOrderType] = useState<OrderTypeEnum>(OrderTypeEnum.ASC);
    const [orderBy, setOrderBy] = useState<keyof CateringFood>("id");
    const [page, setPage] = useState<number>(0);
    const [dataPerPage, setDataPerPage] = useState<number>(10);

    useEffect(() => {
        const handleViewCateringFood = async () => {
            setShowLoading(true);

            const cateringFoodFetch = await fetch(router.basePath + "/api/catering/getCateringFood", {
                method: "POST",
                headers: {
                    "authorization": getSessionToken()
                }
            });

            const cateringFoodData: ViewCateringFoodData = await cateringFoodFetch.json();
            setFoods(cateringFoodData.data);
            setFilteredFoods(cateringFoodData.data);
            setShowLoading(false);
        };
        handleViewCateringFood().then();
    }, []);

    const changeName = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setName(event.target.value);
    const changeCategory = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setCategory(event.target.value);
    const changeAdditionalPrice = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setAdditionalPrice(parseInt(event.target.value));
    const changeReductionPrice = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setReductionPrice(parseInt(event.target.value));

    const handleFilterCateringFood = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let filteredFoods = foods;
        if (event.target.value.length > 0) {
            filteredFoods = foods.filter((food) =>
                food.name.toLowerCase().indexOf(event.target.value) !== -1 ||
                food.category.toLowerCase().indexOf(event.target.value) !== -1 ||
                food.additionalPrice.toString().indexOf(event.target.value) !== -1 ||
                food.reductionPrice.toString().indexOf(event.target.value) !== -1);
        }

        setPage(0);
        setFilter(event.target.value);
        setFilteredFoods(filteredFoods);
    };

    const handleOpenDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);
    const handleCloseAlert = () => setShowAlert(false);
    const handleEnter = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleCreateCateringFood();
    };

    const isDataSelected = (id: number) => selectedFoods.indexOf(id) !== -1;
    const getFirstDataInPage = () => page * dataPerPage;
    const getLastDataInPage = () => getFirstDataInPage() + dataPerPage;
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeDataPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setDataPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property: keyof CateringFood) => () => {
        const isAscending = (orderBy === property && orderType === OrderTypeEnum.ASC);
        setOrderType(isAscending ? OrderTypeEnum.DESC : OrderTypeEnum.ASC);
        setOrderBy(property);
    };

    const handleSelectClick = (id: number) => {
        const selectedIndex = selectedFoods.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedFoods, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedFoods.slice(1));
        } else if (selectedIndex === selectedFoods.length - 1) {
            newSelected = newSelected.concat(selectedFoods.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selectedFoods.slice(0, selectedIndex), selectedFoods.slice(selectedIndex + 1));
        }
        setSelectedFoods(newSelected);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
        (event.target.checked) ?
            setSelectedFoods(foods.map((food) => food.id)) :
            setSelectedFoods([]);

    const handleCreateCateringFood = async () => {
        setShowLoadingForm(true);

        const createCateringFoodFetch = await fetch(router.basePath + "/api/catering/createCateringFood", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
            },
            body: JSON.stringify({
                name: name,
                category: category,
                additionalPrice: additionalPrice,
                reductionPrice: reductionPrice
            }),
        });

        const createCateringFoodData: ChangeCateringFoodData = await createCateringFoodFetch.json();
        if (createCateringFoodData.error) {
            setMessageAlert(createCateringFoodData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            foods.push(createCateringFoodData.data);
            setName("");
            setCategory("");
            setAdditionalPrice(0);
            setReductionPrice(0);
            setMessageAlert(createCateringFoodData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoadingForm(false);
    };

    const handleChangeActiveCateringFood = async (id: number) => {
        setShowLoading(true);

        const updateActiveCateringFoodFetch = await fetch(router.basePath + "/api/catering/updateActiveCateringFood", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
            },
            body: JSON.stringify({
                id: id
            }),
        });

        const updateActiveCateringFoodData: ChangeCateringFoodData = await updateActiveCateringFoodFetch.json();
        if (updateActiveCateringFoodData.error) {
            setMessageAlert(updateActiveCateringFoodData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = foods.findIndex((food) => food.id === id);
            foods[updatedIndex].active = updateActiveCateringFoodData.data.active;
            setMessageAlert(updateActiveCateringFoodData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleDeleteCateringFood = async () => {
        setShowLoading(true);
        setShowDialog(false);

        const deleteCateringFoodFetch = await fetch(router.basePath + "/api/catering/deleteMultipleCateringFood", {
            method: "POST",
            headers: {
                authorization: getSessionToken()
            },
            body: JSON.stringify({
                ids: selectedFoods
            }),
        });

        const deleteCateringFoodData: DeleteCateringFoodData = await deleteCateringFoodFetch.json();
        if (deleteCateringFoodData.error) {
            setMessageAlert(deleteCateringFoodData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            selectedFoods.forEach((data) => {
                const deleteIndex = foods.findIndex((food) => food.id === data);
                foods.splice(deleteIndex, 1);
            });
            setMessageAlert(deleteCateringFoodData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
            setSelectedFoods([]);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    return (
        <HomeLayout title="Manage Catering Food">
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
                        Delete Food(s) Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are about to delete catering food(s) permanently from database. Are you sure?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text"
                                onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button color="error" variant="contained"
                                onClick={handleDeleteCateringFood}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper sx={{padding: 2, paddingBottom: 3, marginBottom: 2}}>

                    <Typography variant="h6">
                        Create Catering Food
                    </Typography>

                    <Box component="form"
                         sx={{paddingTop: 2}}>

                        <TextField type="text" label="Name" variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoadingForm} value={name}
                                   sx={{marginBottom: 2}}
                                   onChange={changeName} onKeyDown={handleEnter}/>

                        <TextField select label="Category" variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoadingForm} value={category}
                                   sx={{marginBottom: 2}}
                                   onChange={changeCategory}>
                            {Object.keys(CateringFoodCategory).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>))}
                        </TextField>

                        <TextField type="number" label="Additional Price" variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoadingForm} value={additionalPrice}
                                   sx={{marginBottom: 2}}
                                   onChange={changeAdditionalPrice} onKeyDown={handleEnter}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">Rp.</InputAdornment>
                                       ),
                                   }}/>

                        <TextField type="number" label="Reduction Price" variant="outlined" size="medium"
                                   fullWidth={true} disabled={showLoadingForm} value={reductionPrice}
                                   sx={{marginBottom: 2}}
                                   onChange={changeReductionPrice} onKeyDown={handleEnter}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">Rp.</InputAdornment>
                                       ),
                                   }}/>

                        <Box sx={{position: "relative"}}>
                            <Button variant="contained" size="large"
                                    fullWidth={true} disabled={showLoadingForm}
                                    onClick={handleCreateCateringFood}>
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

                {(foods.length !== 0) ? (
                    <>
                        <TextField type="text" label="Filter" variant="standard" size="medium"
                                   fullWidth={true} value={filter}
                                   sx={{marginBottom: 2}}
                                   onChange={handleFilterCateringFood}/>

                        <Paper>

                            <Toolbar variant="dense"
                                     sx={{
                                         paddingLeft: {sm: 2}, paddingRight: {xs: 1, sm: 1},
                                         ...(selectedFoods.length > 0 && {
                                             bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                                         })
                                     }}>
                                {selectedFoods.length > 0 ?
                                    <Typography sx={{flex: "1 1 100%"}}>{selectedFoods.length} selected</Typography> :
                                    <Typography sx={{flex: "1 1 100%"}}>Foods</Typography>}
                                {selectedFoods.length > 0 &&
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
                                                          indeterminate={selectedFoods.length > 0 && selectedFoods.length < filteredFoods.length}
                                                          checked={filteredFoods.length > 0 && selectedFoods.length === filteredFoods.length}
                                                          onChange={handleSelectAllClick}/>
                                            </TableCell>
                                            {foodTableHeader.map((tableHeader) => (
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
                                        {filteredFoods
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            .sort(getComparator(orderType, orderBy))
                                            .slice(getFirstDataInPage(), getLastDataInPage())
                                            .map((food) => {
                                                const isItemSelected = isDataSelected(food.id);
                                                return (
                                                    <TableRow key={food.name} tabIndex={-1} hover={!showLoading}
                                                              selected={isItemSelected}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox disabled={showLoading} checked={isItemSelected}
                                                                      onChange={() => handleSelectClick(food.id)}/>
                                                        </TableCell>
                                                        <TableCell width={100} sx={{paddingTop: 0, paddingBottom: 0}}>
                                                            <Tooltip
                                                                title={(food.active) ? "Set to Inactive" : "Set to Active"}>
                                                                <Switch disabled={showLoading} checked={food.active}
                                                                        onChange={() => handleChangeActiveCateringFood(food.id)}/>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            {food.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {convertToIDR(food.additionalPrice)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {convertToIDR(food.reductionPrice)}
                                                        </TableCell>
                                                        <TableCell width={180}>
                                                            {food.category}
                                                        </TableCell>
                                                        <TableCell width={150}>
                                                            {(food.createdBy.fullname) ? food.createdBy.fullname : food.createdBy.username}
                                                        </TableCell>
                                                        <TableCell width={150}>
                                                            {(food.lastUpdatedBy.fullname) ? food.lastUpdatedBy.fullname : food.lastUpdatedBy.username}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" rowsPerPageOptions={[5, 10, 15, 20]}
                                             count={filteredFoods.length} page={page} rowsPerPage={dataPerPage}
                                             onPageChange={handleChangePage}
                                             onRowsPerPageChange={handleChangeDataPerPage}/>

                        </Paper>
                    </>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no catering food data.
                    </Alert>
                )}

            </>
        </HomeLayout>
    );
}
