/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { UIContext } from "../context/UIContext";
import { Web3Context } from "../context/Web3Context";
import copyToClipboard from "../utils/copyToClipboard";
import shortenAddress from "../utils/shortenAddress";
import { gasToValue, stringToValue } from "../utils/values";
import AlertDialog from "./AlertDialog";
import Loading from "./Loading";

const ConfirmSendDialog = (): JSX.Element => {
  const { openConfirmSendDialog, setOpenConfirmSendDialog, openAddAssetDialog, previewRequired } =
    useContext(UIContext);
  const { currentAsset } = useContext(AccountContext);
  const {
    isValidTransaction,
    setIsValidTransaction,
    estimatedTxnResult,
    setEstimatedTxnResult,
    handleSend,
    setRecipientAddress,
    setAmount,
  } = useContext(Web3Context);
  const [rows, setRows] = useState<any>([]);

  useEffect(() => {
    if (isValidTransaction && !openAddAssetDialog && previewRequired) {
      if (estimatedTxnResult) {
        const txn: any = estimatedTxnResult;
        const _amount = txn.payload.arguments[1];
        const gasUsedInApt = gasToValue(estimatedTxnResult.gas_used, estimatedTxnResult.gas_unit_price);
        const maxGasInApt = gasToValue(estimatedTxnResult.max_gas_amount, estimatedTxnResult.gas_unit_price);
        setOpenConfirmSendDialog(true);
        setRows([
          createData("Sender", estimatedTxnResult.sender),
          createData("Recipient", txn.payload.arguments[0]),
          createData("Amount", `${stringToValue(currentAsset!, _amount)} ${currentAsset!.data.symbol}`),
          createData("Gas cost", `${gasUsedInApt} APT`),
          createData("Max gas", `${maxGasInApt} APT`),
        ]);
      }
    }
  }, [isValidTransaction]);

  const createData = (name: string, value: any): any => {
    return { name, value };
  };

  const handleConfirm = (): void => {
    handleSend();
  };

  const handleCancel = (): void => {
    setOpenConfirmSendDialog(false);
    setIsValidTransaction(false);
    setEstimatedTxnResult(undefined);
    setRecipientAddress("");
    setAmount("");
  };

  return (
    <Dialog open={openConfirmSendDialog} onClose={handleCancel}>
      <DialogTitle align="center">Preview Transaction</DialogTitle>
      <DialogContent>
        <TableContainer
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordWrap: "break-word",
          }}
        >
          <Table aria-label="transaction-data" sx={{ width: "260px" }}>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ maxWidth: "65px" }} component="th" scope="row">
                    <Typography variant="inherit">{row.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: "90px" }}>
                    {row.name === "Sender" || row.name === "Recipient" ? (
                      <Tooltip title="Copy address" sx={{ ml: -1.5 }}>
                        <Chip
                          label={shortenAddress(row.value)}
                          onClick={() => {
                            copyToClipboard(row.value);
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="inherit">{row.value}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          mb: 4,
        }}
      >
        <Button sx={{ width: "121px", mr: 4 }} variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          sx={{
            background: "linear-gradient(126.53deg, #3FE1FF -25.78%, #1700FF 74.22%);",
            width: "121px",
          }}
          variant="contained"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Stack>
      <Loading />
      <AlertDialog />
    </Dialog>
  );
};

export default ConfirmSendDialog;
