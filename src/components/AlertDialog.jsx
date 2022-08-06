import { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { UIContext } from "../context/UIContext";
import { AccountContext } from "../context/AccountContext";

const AlertDialog = () => {
  const [isTransaction, setIsTransaction] = useState(false);
  const {
    openAlertDialog,
    setOpenAlertDialog,
    setOpenMintDialog,
    setOpenSendDialog,
    setOpenConfirmSendDialog,
    setOpenCreateCollectionDialog,
    setOpenCreateNftDialog,
  } = useContext(UIContext);
  const {
    alertSignal,
    setAlertSignal,
    alertTitle,
    setAlertTitle,
    alertMessage,
    setAlertMessage,
    setMnemonic,
    handleLogout,
  } = useContext(AccountContext);

  const checkDialogType = async () => {
    if (alertSignal === 31 || alertSignal === 61 || alertSignal === 71) {
      setIsTransaction(true);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigator.clipboard.writeText(alertMessage);
  };

  const handleOpen = () => {
    // if transaction estimated as valid => handle TransactionDialog
    // instead of sending alert, else => proceed with alert
    if (alertSignal !== 30) {
      alertSignal > 0 && setOpenAlertDialog(true);
    }
  };

  const handleClose = () => {
    switch (alertSignal) {
      case 1: // Account created
      case 11: // Account imported
        setOpenAlertDialog(false);
        navigate("/");
        break;
      case 21: // Coins minted
        setOpenAlertDialog(false);
        setOpenMintDialog(false);
        navigate("/");
        break;
      case 31: // Transaction sent
      case 33: // Transaction estimated as invalid
      case 34: // Failed estimate transaction
        setOpenAlertDialog(false);
        setOpenSendDialog(false);
        setOpenConfirmSendDialog(false);
        setIsTransaction(false);
        break;
      case 61: // Collection Created
        setOpenAlertDialog(false);
        setOpenCreateCollectionDialog(false);
        setIsTransaction(false);
        break;
      case 71: // NFT Created
        setOpenAlertDialog(false);
        setOpenCreateNftDialog(false);
        setIsTransaction(false);
      case 81:
        setOpenAlertDialog(false);
        setAlertSignal(0);
        setAlertTitle("");
        setAlertMessage("");
      case 91:
        setOpenAlertDialog(false);
        setAlertSignal(0);
        setAlertTitle("");
        setAlertMessage("");
        setMnemonic("");
        break;
      case 2: // Failed create account
      case 12: // Failed import account
      case 22: // Failed mint coins
      case 32: // Transaction failed
      case 41: // Account loaded from localStorage
      case 42: // Failed load account
      case 52: // Password field cannot be empty
      case 53: // Passwords do not match
      case 54: // Password must at least 6 characters long
      case 55: // Failed load account
      case 62: // Failed create collection
      case 72: // Failed create nft
      case 92: // No mnemonic phrase found
        setOpenAlertDialog(false);
        break;
      case 93: // Unencrypted data is not supported in this version. Please login again to start using encryption
        setOpenAlertDialog(false);
        handleLogout();
    }
    setAlertSignal(0);
  };

  useEffect(() => {
    checkDialogType();
    handleOpen();
  }, [alertSignal]);

  return (
    <Dialog open={openAlertDialog} onClose={handleClose}>
      {alertSignal === 81 || alertSignal === 91 ? (
        <DialogTitle align="center">{alertTitle}</DialogTitle>
      ) : (
        <DialogTitle>{alertTitle}</DialogTitle>
      )}
      <DialogContent sx={{ minWidth: 250, maxWidth: 375 }}>
        {isTransaction && (
          <Stack component="span" sx={{ maxWidth: 250 }}>
            <Typography component="span">
              Open transactions
              <Link
                sx={{ ml: 0.5 }}
                component={RouterLink}
                to="/transactions"
                underline="none"
                onClick={handleClose}
              >
                log
              </Link>{" "}
              or view full details in{" "}
              <Link
                href={`https://explorer.devnet.aptos.dev/txn/${alertMessage}`}
                target="_blank"
                underline="none"
                onClick={handleClose}
              >
                Aptos Explorer {""}
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </Link>
            </Typography>
          </Stack>
        )}
        {alertSignal === 81 || alertSignal === 91 ? (
          <Stack sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <TextField
              sx={{ width: 250, marginBottom: 2 }}
              error
              multiline
              maxRows={6}
              value={alertMessage}
            />
            <Stack component="span" sx={{ maxWidth: 250 }}>
              <Typography component="span" align="center" sx={{ mb: 2 }} color="error.main">
                Never share your secret phrase or private key with anyone.
                <br />
                Use with caution.
              </Typography>
            </Stack>
            <Button variant="outlined" color="error" onClick={handleClick}>
              Copy to clipboard
            </Button>
          </Stack>
        ) : (
          !isTransaction && (
            <Stack sx={{ overflow: "hidden", textOverflow: "ellipsis", wordWrap: "break-word" }}>
              <Typography>{alertMessage}</Typography>
            </Stack>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
