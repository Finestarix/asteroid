import {SyntheticEvent, useEffect, useState} from "react";

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import HomeLayout from "@components/layout/HomeLayout";
import {
    CateringPaymentType,
    CateringTransactionDetail,
    ViewCateringTransactionHistoryData,
} from "types/cateringType";
import {convertToIDR} from "utils/currency";
import {convertDateGeneral} from "utils/date";
import {getSessionToken} from "utils/storage";
import Alert from "@mui/material/Alert";


export default function CateringHistoryPage() {

    const [transactions, setTransaction] = useState<CateringTransactionDetail[]>([]);
    const [subTotal, setSubTotal] = useState<number[]>([]);
    const [total, setTotal] = useState<number[]>([]);
    const [totalUnpaid, setTotalUnpaid] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleViewCateringTransactionHistory = async () => {
            setShowLoading(true);

            const cateringTransactionHistoryFetch = await fetch("http://localhost:3000/api/catering/getCateringTransactionHistory", {
                method: "POST",
                headers: {
                    "authorization": getSessionToken()
                }
            });

            const cateringTransactionHistoryData: ViewCateringTransactionHistoryData = await cateringTransactionHistoryFetch.json();
            setTransaction(cateringTransactionHistoryData.data);

            let totalUnpaidTemp = 0;
            const subTotalTemp = [];
            const totalTemp = [];
            for (const transaction of cateringTransactionHistoryData.data) {
                let priceTemp = transaction.header.basePrice;
                for (const food of transaction.foods) {
                    if (food.food.additionalPrice) priceTemp += food.food.additionalPrice;
                    if (food.food.reductionPrice) priceTemp -= food.food.reductionPrice;
                }
                subTotalTemp.push(priceTemp);
                priceTemp += transaction.header.deliveryPrice;
                totalTemp.push(priceTemp);
                if (transaction.paymentType === CateringPaymentType.NotPaid) {
                    totalUnpaidTemp += priceTemp;
                }
            }
            setSubTotal(subTotalTemp);
            setTotal(totalTemp);
            setTotalUnpaid(totalUnpaidTemp);
            setShowLoading(false);
        };
        handleViewCateringTransactionHistory().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccordion = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) =>
        setExpanded(isExpanded ? panel : false);

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

                {(transactions.length > 0) ? (
                    <>
                        <Box sx={{marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
                            <Typography>
                                Total Unpaid: {convertToIDR(totalUnpaid)}
                            </Typography>
                            <Button size="small" variant="contained"
                                    startIcon={<AttachMoneyIcon/>}>
                                Payment
                            </Button>
                        </Box>
                        {transactions.map((transaction, index) => (
                            <Accordion key={transaction.id} expanded={expanded === "accordion" + index}
                                       onChange={handleAccordion("accordion" + index)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                        Catering {convertDateGeneral(transaction.header.date)}
                                        <Chip size="small"
                                              color={(transaction.paymentType === CateringPaymentType.NotPaid) ? "primary" : "default"}
                                              label={transaction.paymentType}
                                              sx={{marginRight: 2}}/>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box>
                                        <TableContainer sx={{marginBottom: 2, whiteSpace: "nowrap"}}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>Details</TableCell>
                                                        <TableCell width={150}>Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>Catering</TableCell>
                                                        <TableCell>{convertToIDR(transaction.header.basePrice)}</TableCell>
                                                    </TableRow>
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