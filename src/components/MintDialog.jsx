import { useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  DialogTitle,
  Stack,
} from "@mui/material";
import Loading from "./Loading";
import AlertDialog from "./AlertDialog";
import { UIContext } from "../context/UIContext";
import { Web3Context } from "../context/Web3Context";

const MintDialog = () => {
  const { openMintDialog, setOpenMintDialog } = useContext(UIContext);
  const { amount, setAmount, handleMint } = useContext(Web3Context);

  const handleCancel = () => {
    setAmount("");
    setOpenMintDialog(false);
  };

  return (
    <Dialog align="center" open={openMintDialog} onClose={handleCancel}>
      <DialogTitle align="center">Mint test APT</DialogTitle>
      <DialogContent align="center">
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "300px",
            mt: 3,
          }}
        >
          <TextField
            sx={{ marginTop: 3, width: "275px" }}
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <Button variant="outlined" sx={{ width: "121px", mr: 4 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            sx={{
              background: "linear-gradient(126.53deg, #3FE1FF -25.78%, #1700FF 74.22%);",
              width: "121px",
            }}
            variant="contained"
            onClick={handleMint}
          >
            Mint
          </Button>
        </Stack>
      </DialogContent>
      <Loading />
      <AlertDialog />
    </Dialog>
  );
};

export default MintDialog;
