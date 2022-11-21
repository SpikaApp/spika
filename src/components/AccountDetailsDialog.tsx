/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { UIContext } from "../context/UIContext";
import saveToFile from "../utils/saveToFile";

const AccountDetailsDialog = (): JSX.Element => {
  const { openAccountDetailsDialog, setOpenAccountDetailsDialog } = useContext(UIContext);
  const { publicAccount } = useContext(AccountContext);

  const title = `Spika wallet public account credentials:`;
  const breakLine = "========================================";
  const address = `address: ${publicAccount!.account}`;
  const publicKey = `publicKey: ${publicAccount!.publicKey}`;
  const authKey = `authKey: ${publicAccount!.authKey}`;

  const handleSave = (): void => {
    saveToFile("account", `${title}\n${breakLine}\n${address}\n${publicKey}\n${authKey}`);
  };

  const handleCancel = (): void => {
    setOpenAccountDetailsDialog(false);
  };

  return (
    <Dialog open={openAccountDetailsDialog}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Stack direction="row">
          Public Account Details
          <Tooltip title="Save to file">
            <IconButton sx={{ mt: "-4px", ml: "5px" }} onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <form className="login-form">
          <Stack
            component="span"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "300px",
            }}
          >
            <TextField
              sx={{ mt: 1.5, mb: 1.5, width: "275px" }}
              id="address"
              label="Address"
              margin="normal"
              autoFocus={false}
              autoComplete="off"
              multiline
              rows={3}
              variant="outlined"
              value={publicAccount!.account}
            />
            <TextField
              sx={{ mt: 1.5, mb: 1.5, width: "275px" }}
              id="publicKey"
              label="Public Key"
              margin="normal"
              autoFocus={false}
              autoComplete="off"
              multiline
              rows={3}
              variant="outlined"
              value={publicAccount!.publicKey}
            />
            <TextField
              sx={{ mt: 1.5, width: "275px" }}
              id="authKey"
              label="Auth Key"
              margin="normal"
              autoFocus={false}
              autoComplete="off"
              multiline
              rows={3}
              variant="outlined"
              value={publicAccount!.authKey}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDetailsDialog;
