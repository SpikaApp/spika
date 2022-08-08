import React, { useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Tooltip,
  Stack,
  Link,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import Loading from "../components/Loading";
import AlertDialog from "../components/AlertDialog";
import MintDialog from "../components/MintDialog";
import SendDialog from "../components/SendDialog";
import ConfirmSendDialog from "../components/ConfirmSendDialog";
import ReceiveDialog from "../components/ReceiveDialog";
import { UIContext } from "../context/UIContext";
import { AccountContext } from "../context/AccountContext";
import { Web3Context } from "../context/Web3Context";
import aptos_light from "../assets/aptos_light.png";
import aptos_dark from "../assets/aptos_dark.png";
import { PLATFORM } from "../utils/constants";
import shortenAddress from "../utils/shorten_address";
import copyToClipboard from "../utils/copy_clipboard";

const Wallet = () => {
  const { darkMode, handleMintUI, handleSendUI, handleReceiveUI } = useContext(UIContext);
  const { currentAddress, accountImported, balance } = useContext(AccountContext);
  const { getBalance } = useContext(Web3Context);

  useEffect(() => {
    if (accountImported) {
      const updateAccountResources = window.setInterval(() => {
        getBalance();
      }, 10000);
      return () => window.clearInterval(updateAccountResources);
    }
    return undefined;
  }, [accountImported]);

  const handleClick = () => {
    copyToClipboard(currentAddress);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
        <AccountBalanceWalletIcon sx={{ marginTop: 2, fontSize: 48 }} color="primary" />
        <br />
        Spika Web Wallet
      </Typography>
      <Card sx={{ mb: 2, minHeight: 350 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {accountImported ? (
            <div>
              <Stack sx={{ alignItems: "center", mt: 1 }}>
                <Typography sx={{ mb: 1.5 }}>Network: Aptos Devnet</Typography>
                <Tooltip title="Copy address">
                  <Chip
                    sx={{ mb: 1 }}
                    label={shortenAddress(currentAddress)}
                    onClick={handleClick}
                  />
                </Tooltip>
              </Stack>
            </div>
          ) : (
            <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
              Welcome
            </Typography>
          )}
          {accountImported ? (
            <Stack sx={{ display: "flex", alignItems: "center", my: -2 }}>
              {darkMode ? (
                <CardMedia sx={{ mb: 1.5 }} component="img" image={aptos_dark} alt="aptos" />
              ) : (
                <CardMedia sx={{ mb: 1.5 }} component="img" image={aptos_light} alt="aptos" />
              )}

              <Typography
                sx={{ mb: 1 }}
                variant="h6"
                align="center"
                color="textSecondary"
                gutterBottom
              >
                {balance} APTOS
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h6" align="center" color="textPrimary">
              Create or import existing account to start working with wallet
            </Typography>
          )}
          {accountImported === false && (PLATFORM === "http:" || PLATFORM === "https:") && (
            <Typography variant="subtitle1" align="center" color="textPrimary" sx={{ mt: 2 }}>
              For optimal experience it is advisable to install Spika as browser{" "}
              <Link
                href="https://chrome.google.com/webstore/detail/spika/fadkojdgchhfkdkklllhcphknohbmjmb"
                underline="none"
                target="_blank"
              >
                {" "}
                extension
              </Link>
              . Some features may not be supported when running in browser's tab
            </Typography>
          )}
          {accountImported === false && PLATFORM === "chrome-extension:" && (
            <Typography variant="subtitle1" align="center" color="textPrimary" sx={{ mt: 2 }}>
              Spika is connected to Aptos Devnet and all account addresses and resources will be
              deleted with scheduled weekly Devnet update
            </Typography>
          )}
        </CardContent>
        {accountImported ? (
          <CardActions>
            <Stack sx={{ display: "flex", alignItems: "center" }}>
              <Button sx={{ mb: 2.5 }} variant="outlined" onClick={handleMintUI}>
                Mint Test Coins
              </Button>

              <Stack direction="row" sx={{ mt: 2 }}>
                <Button
                  sx={{ mr: 4 }}
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSendUI}
                >
                  Send
                </Button>
                <Button variant="contained" endIcon={<DownloadIcon />} onClick={handleReceiveUI}>
                  Receive
                </Button>
              </Stack>
            </Stack>
          </CardActions>
        ) : (
          <CardActions>
            <Stack direction="column">
              <Button variant="contained" component={RouterLink} to="create" sx={{ mb: 2.5 }}>
                Create Account
              </Button>
              <Button variant="contained" component={RouterLink} to="import">
                Import Account
              </Button>
            </Stack>
          </CardActions>
        )}
      </Card>
      <Loading />
      <MintDialog />
      <SendDialog />
      <ConfirmSendDialog />
      <ReceiveDialog />
      <AlertDialog />
    </Container>
  );
};

export default Wallet;
