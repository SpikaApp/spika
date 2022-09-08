import React, { useContext } from "react";
import { ListItem, Box, Stack, Typography, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TxnDetailsDialog from "./TxnDetailsDialog";
import { UIContext } from "../context/UIContext";
import { AccountContext } from "../context/AccountContext";
import { Web3Context } from "../context/Web3Context";
import { stringToValue } from "../utils/values";

const DepositEventCard = ({
  depositEvent: {
    version,
    data: { amount },
  },
}) => {
  const { setOpenTxnDetailsDialog, setTxnType } = useContext(UIContext);
  const { currentAsset } = useContext(AccountContext);
  const { getTxnDetails, setAmount } = useContext(Web3Context);

  const handleOpenTxnDetailsDialog = async () => {
    setTxnType(2);
    setAmount(amount);
    await getTxnDetails(version);
    setOpenTxnDetailsDialog(true);
  };

  return (
    <ListItem>
      <Button
        sx={{ ml: 1.5, textTransform: "none", maxWidth: "290px" }}
        onClick={handleOpenTxnDetailsDialog}
      >
        <DownloadIcon sx={{ fontSize: 24, mr: 2 }} color="primary" />
        <Stack>
          <Stack sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Typography sx={{ mr: 0.5 }}>Txn {version} </Typography>
            <Stack direction="row">
              <Typography noWrap sx={{ mr: 0.5, maxWidth: "90px" }}>
                {stringToValue(currentAsset, amount)}
              </Typography>
              <Typography sx={{ mr: 0.5, maxWidth: "40px" }}>{currentAsset.data.symbol}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Button>
      <TxnDetailsDialog />
    </ListItem>
  );
};

export default DepositEventCard;
