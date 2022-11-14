import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { PayloadContext } from "../context/PayloadContext";
import { UIContext } from "../context/UIContext";
import { Web3Context } from "../context/Web3Context";
import AlertDialog from "./AlertDialog";
import Loading from "./Loading";

const CreateNftDialog = () => {
  const { openCreateNftDialog, setOpenCreateNftDialog } = useContext(UIContext);
  const { currentAddress, throwAlert } = useContext(AccountContext);
  const { nft } = useContext(PayloadContext);
  const { estimateTransaction, isValidTransaction, estimatedTxnResult, clearPrevEstimation, createToken } =
    useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  const [estimationRequired, setEstimationRequired] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftUri, setNftUri] = useState("");

  useEffect(() => {
    if (estimationRequired) {
      handleEstimateNft();
      setEstimationRequired(false);
    }
  }, [estimationRequired]);

  const handleEstimationRequired = async () => {
    setEstimationRequired(true);
  };

  const nftPayload = async () => {
    const payload = await nft(currentAddress, collectionName, nftName, nftDescription, 1, nftUri, 1);
    return payload;
  };

  const handleEstimateNft = async () => {
    setIsLoading(true);
    try {
      const payload = await nftPayload();
      await estimateTransaction(payload, true, true);
    } catch (error) {
      throwAlert({ signal: 73, title: "Error", message: `${error}`, error: true });
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleCreateNft = async () => {
    const payload = await nftPayload();
    await createToken(payload);
    handleCancel();
  };

  const clearNftData = () => {
    setCollectionName("");
    setNftName("");
    setNftDescription("");
    setNftUri("");
  };
  const handleCancel = () => {
    setOpenCreateNftDialog(false);
    clearPrevEstimation();
    clearNftData();
  };

  return (
    <Dialog open={openCreateNftDialog} onClose={handleCancel}>
      <DialogTitle>
        <Stack sx={{ display: "flex", alignItems: "center" }}>Create NFT</Stack>
      </DialogTitle>
      <DialogContent>
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
            sx={{ mt: 1, mb: 1.5, width: "275px" }}
            id="collectionName"
            label="Collection name"
            type="string"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
          <TextField
            sx={{ mt: 1.5, mb: 1.5, width: "275px" }}
            id="nftName"
            label="NFT name"
            type="string"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
          />
          <TextField
            sx={{ mt: 1.5, mb: 1.5, width: "275px" }}
            id="nftDescription"
            label="NFT description"
            type="string"
            multiline
            rows={2}
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
          />
          <TextField
            sx={{ mt: 1.5, width: "275px" }}
            id="nftUri"
            label="URL"
            type="string"
            value={nftUri}
            onChange={(e) => setNftUri(e.target.value)}
          />
        </Stack>
        <Box
          sx={{
            // backgroundColor: "background.paper",
            minHeight: "24px",
            alignSelf: "center",
            justifyContent: "center",
            mt: "4px",
            maxWidth: "275x",
          }}
        >
          {isValidTransaction && (
            <Typography
              noWrap
              align="center"
              variant="subtitle2"
              color="warning.dark"
              sx={{
                maxWidth: "260px",
                mt: "2px",
                ml: "12px",
                mr: "12px",
              }}
            >
              Estimated network fee: {estimatedTxnResult.gas_used}
            </Typography>
          )}

          <Stack>
            {estimatedTxnResult && !isValidTransaction && (
              <Typography
                variant="subtitle2"
                color="error.dark"
                sx={{
                  maxWidth: "260px",
                  overflow: "hidden",
                  overflowY: "scroll",
                  textOverflow: "ellipsis",
                  wordWrap: "break-word",
                  maxHeight: "48px",
                  mt: "2px",
                }}
              >
                {estimatedTxnResult.vm_status}
              </Typography>
            )}
          </Stack>
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
            mb: 2,
          }}
        >
          <Button sx={{ width: "121px", mr: 4 }} variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          {!isValidTransaction &&
            collectionName !== "" &&
            nftName !== "" &&
            nftDescription !== "" &&
            nftUri !== "" && (
              <LoadingButton
                sx={{
                  background: "linear-gradient(126.53deg, #3FE1FF -25.78%, #1700FF 74.22%);",
                  width: "121px",
                }}
                variant="contained"
                loadingIndicator={<CircularProgress sx={{ color: "#FFFFFFF" }} size={18} />}
                loading={isLoading}
                onClick={handleEstimationRequired}
              >
                Estimate
              </LoadingButton>
            )}{" "}
          {!isValidTransaction && (collectionName === "" || nftName === "" || nftDescription === "" || nftUri === "") && (
            <Button
              sx={{
                width: "121px",
              }}
              variant="contained"
              disabled
            >
              Estimate
            </Button>
          )}
          {isValidTransaction && (
            <LoadingButton
              sx={{
                background: "linear-gradient(126.53deg, #3FE1FF -25.78%, #1700FF 74.22%);",
                width: "121px",
              }}
              variant="contained"
              loadingIndicator={<CircularProgress sx={{ color: "#FFFFFFF" }} size={18} />}
              loading={isLoading}
              onClick={handleCreateNft}
            >
              Create
            </LoadingButton>
          )}
        </Stack>
      </DialogContent>
      <Loading />
      <AlertDialog />
    </Dialog>
  );
};

export default CreateNftDialog;
