import { useContext } from "react";
import { Container, Card, CardContent, Stack, Button, Tooltip, Chip } from "@mui/material";
import Footer from "../components/Footer";
import { AccountContext } from "../context/AccountContext";
import { UIContext } from "../context/UIContext";
import AccountDetailsDialog from "../components/AccountDetailsDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import shortenAddress from "../utils/shorten_address";
import copyToClipboard from "../utils/copy_clipboard";

const Settings = () => {
  const {
    handleMnemonicUI,
    handlePrivateKeyUI,
    handleChangePasswordUI,
    setOpenAccountDetailsDialog,
  } = useContext(UIContext);
  const { accountImported, currentAddress } = useContext(AccountContext);

  const handleClick = () => {
    copyToClipboard(currentAddress);
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mb: 2, mt: "100px", minHeight: "450px" }}>
        <CardContent align="center">
          {accountImported && (
            <Tooltip sx={{ mb: 3 }} title="Copy address">
              <Chip label={shortenAddress(currentAddress)} onClick={handleClick} />
            </Tooltip>
          )}
          {accountImported && (
            <Stack sx={{ width: "200px" }}>
              <Button
                sx={{ mb: 2 }}
                variant="outlined"
                onClick={() => {
                  setOpenAccountDetailsDialog(true);
                }}
              >
                Public Account Details
              </Button>
              <Button sx={{ mb: 2 }} variant="outlined" onClick={handleMnemonicUI}>
                Show Recovery Phrase
              </Button>
              <Button sx={{ mb: 2 }} variant="outlined" onClick={handlePrivateKeyUI}>
                Show Private Key
              </Button>
              <Button sx={{ mb: 2 }} variant="outlined" onClick={handleChangePasswordUI}>
                Change Password
              </Button>
              <Button sx={{ mb: 2 }} variant="outlined" disabled>
                Change Network
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
      <Footer />
      <AccountDetailsDialog />
      <ChangePasswordDialog />
    </Container>
  );
};

export default Settings;
