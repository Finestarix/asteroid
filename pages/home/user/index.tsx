import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import Alert, { AlertColor } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";

import HomeLayout from "@components/layout/HomeLayout";
import {AlertTypeEnum, OrderTypeEnum, TableHeadKey} from "types/generalType";
import {UpdateDeleteUserData, User, UserRole, UserStatus, ViewUserData} from "types/userType";
import {getComparator} from "utils/comparator";
import {decryptData} from "utils/encryption";
import {getSessionToken} from "utils/storage";


export default function ManageUserPage() {

    const userTableHeader: TableHeadKey[] = [
        {id: "alias", label: "Alias", sort: true},
        {id: "username", label: "Username", sort: true},
        {id: "role", label: "Role", sort: true},
        {id: "action", label: "Action", sort: false}
    ];

    const [users, setUsers] = useState<User[]>([]);
    const [selectedChangeUser, setSelectedChangeUser] = useState<User>();
    const [filter, setFilter] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [alias, setAlias] = useState<string>("");
    const [typeAlert, setTypeAlert] = useState<AlertColor>("error");
    const [messageAlert, setMessageAlert] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [orderType, setOrderType] = useState<OrderTypeEnum>(OrderTypeEnum.ASC);
    const [orderBy, setOrderBy] = useState<keyof User>("id");
    const [page, setPage] = useState<number>(0);
    const [dataPerPage, setDataPerPage] = useState<number>(10);

    useEffect(() => {
        const handleViewUser = async () => {
            setShowLoading(true);

            const userFetch = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "authorization": decryptData(getSessionToken())
                }
            });

            const userData: ViewUserData = await userFetch.json();
            setUsers(userData.data);
            setFilteredUsers(userData.data);
            setShowLoading(false);
        };
        handleViewUser().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeAlias = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setAlias(event.target.value);

    const handleFilterUser = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let filteredUsers = users;
        if (event.target.value.length > 0) {
            filteredUsers = users.filter((user) =>
                ((user.alias) ? user.alias.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 : false) ||
                user.username.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1);
        }

        setPage(0);
        setFilter(event.target.value);
        setFilteredUsers(filteredUsers);
    };

    const handleOpenDialog = (user: User) => {
        setSelectedChangeUser(user);
        setShowDialog(true);
    };
    const handleCloseDialog = () => setShowDialog(false);
    const handleCloseAlert = () => setShowAlert(false);
    const handleEnter = async (event?: SyntheticEvent | Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event.code === "Enter") await handleChangeAliasUser();
    };

    const getFirstDataInPage = () => page * dataPerPage;
    const getLastDataInPage = () => getFirstDataInPage() + dataPerPage;
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeDataPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setDataPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property: keyof User) => () => {
        const isAscending = (orderBy === property && orderType === OrderTypeEnum.ASC);
        setOrderType(isAscending ? OrderTypeEnum.DESC : OrderTypeEnum.ASC);
        setOrderBy(property);
    };

    const handleChangeAliasUser = async () => {
        setShowLoading(true);
        setShowDialog(false);

        const updateAliasUserFetch = await fetch("/api/user/updateAliasUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                id: selectedChangeUser.id,
                alias: alias
            }),
        });

        const updateAliasUserData: UpdateDeleteUserData = await updateAliasUserFetch.json();
        if (updateAliasUserData.error) {
            setMessageAlert(updateAliasUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const updatedIndex = users.findIndex((user) => user.id === selectedChangeUser.id);
            users[updatedIndex].alias = updateAliasUserData.data.alias;
            setMessageAlert(updateAliasUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setAlias("");
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleChangeRoleUser = async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, id: number) => {
        setShowLoading(true);

        const updateRoleUserFetch = await fetch("/api/user/updateRoleUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: id,
                role: event.target.value
            }),
        });

        const updateRoleUserData: UpdateDeleteUserData = await updateRoleUserFetch.json();
        if (updateRoleUserData.error) {
            setMessageAlert(updateRoleUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = users.findIndex((user) => user.id === id);
            users[updatedIndex].role = updateRoleUserData.data.role;
            setMessageAlert(updateRoleUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleChangeStatusUser = async (id: number, status: UserStatus) => {
        setShowLoading(true);

        const updateStatusUserFetch = await fetch("/api/user/updateStatusUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: id,
                status: status
            }),
        });

        const updateStatusUserData: UpdateDeleteUserData = await updateStatusUserFetch.json();
        if (updateStatusUserData.error) {
            setMessageAlert(updateStatusUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = users.findIndex((user) => user.id === id);
            users[updatedIndex].status = updateStatusUserData.data.status;
            setMessageAlert(updateStatusUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    const handleChangeDeleteUser = async (id: number) => {
        setShowLoading(true);

        const updateDeleteUserFetch = await fetch("/api/user/updateDeleteUser", {
            method: "POST",
            headers: {
                authorization: decryptData(getSessionToken())
            },
            body: JSON.stringify({
                id: id
            }),
        });

        const updateDeleteUserData: UpdateDeleteUserData = await updateDeleteUserFetch.json();
        if (updateDeleteUserData.error) {
            setMessageAlert(updateDeleteUserData.error);
            setTypeAlert(AlertTypeEnum.ERROR);
        } else {
            const updatedIndex = users.findIndex((user) => user.id === id);
            users[updatedIndex].deleted = updateDeleteUserData.data.deleted;
            setMessageAlert(updateDeleteUserData.success);
            setTypeAlert(AlertTypeEnum.SUCCESS);
        }
        setShowAlert(true);
        setShowLoading(false);
    };

    return (
        <HomeLayout title="Manage User">
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

                {(selectedChangeUser) && (
                    <Dialog open={showDialog}
                            onClose={handleCloseDialog}>
                        <DialogTitle>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/*@ts-ignore*/}
                            Update {selectedChangeUser.username}&apos;s Alias
                        </DialogTitle>
                        <DialogContent>
                            <TextField type="text" label="Alias" variant="outlined" size="medium"
                                       fullWidth={true} disabled={showLoading} value={alias}
                                       sx={{marginTop: 1}}
                                       onChange={changeAlias} onKeyDown={handleEnter}/>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text"
                                    onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button variant="contained"
                                    onClick={handleChangeAliasUser}>
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>)}

                {(users.length !== 0) ? (
                    <>
                        <TextField type="text" label="Filter" variant="standard" size="medium"
                                   fullWidth={true} value={filter}
                                   sx={{marginBottom: 2}}
                                   onChange={handleFilterUser}/>

                        <Paper>

                            <TableContainer>
                                <Table size="small" sx={{whiteSpace: "nowrap"}}>

                                    <TableHead>
                                        <TableRow>
                                            {userTableHeader.map((tableHeader) => (
                                                (tableHeader.sort) ? (
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
                                                ) : (
                                                    <TableCell key={tableHeader.id}>
                                                        {tableHeader.label}
                                                    </TableCell>
                                                )
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredUsers
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        .sort(getComparator(orderType, orderBy))
                                        .slice(getFirstDataInPage(), getLastDataInPage())
                                        .map((user) => {
                                            return (
                                                <TableRow key={user.id} tabIndex={-1} hover={!showLoading}>
                                                    <TableCell width={130}>
                                                        {(user.alias) ?
                                                            <Chip size="small" variant="filled"
                                                                  label={user.alias}/> :
                                                            <Chip color="error" size="small" variant="outlined"
                                                                  label="Not Set Yet"/>}
                                                    </TableCell>
                                                    <TableCell width={100}>
                                                        {user.username}
                                                    </TableCell>
                                                    <TableCell width={180}>
                                                        <TextField select variant="outlined" size="small"
                                                                   fullWidth={true} disabled={showLoading} value={user.role}
                                                                   onChange={(event) => handleChangeRoleUser(event, user.id)}>
                                                            {Object.keys(UserRole).map((option, index) => (
                                                                <MenuItem key={index} value={option}>
                                                                    {option}
                                                                </MenuItem>))}
                                                        </TextField>
                                                    </TableCell>
                                                    <TableCell>
                                                        <ButtonGroup orientation="vertical" variant="outlined" size="small"
                                                                     sx={{minWidth: "100px"}}>
                                                            {(!user.deleted) &&
                                                                <Button color="inherit"
                                                                        onClick={() => handleOpenDialog(user)}>
                                                                    Change Alias
                                                                </Button>}
                                                            {([UserStatus.Requested, UserStatus.Blocked].includes(user.status) && !user.deleted) &&
                                                                <Button onClick={() => handleChangeStatusUser(user.id, UserStatus.Accepted)}>
                                                                    Accept
                                                                </Button>}
                                                            {([UserStatus.Requested, UserStatus.Accepted].includes(user.status) && !user.deleted) &&
                                                                <Button onClick={() => handleChangeStatusUser(user.id, UserStatus.Blocked)}>
                                                                    Block
                                                                </Button>}
                                                            {(user.deleted) ?
                                                                <Button color="error"
                                                                        onClick={() => handleChangeDeleteUser(user.id)}>
                                                                    Restore
                                                                </Button> :
                                                                <Button color="error"
                                                                        onClick={() => handleChangeDeleteUser(user.id)}>
                                                                    Delete
                                                                </Button>}
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" rowsPerPageOptions={[5, 10, 15, 20]}
                                             count={filteredUsers.length} page={page} rowsPerPage={dataPerPage}
                                             onPageChange={handleChangePage}
                                             onRowsPerPageChange={handleChangeDataPerPage}/>

                        </Paper>
                    </>
                ) : (
                    <Alert variant="outlined" severity="info">
                        There is no user data.
                    </Alert>
                )}

            </>
        </HomeLayout>
    );
}
