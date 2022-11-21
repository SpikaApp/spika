import {
  Box,
  Button,
  CircularProgress,
  Container,
  ImageList,
  ImageListItem,
  Pagination,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import default_nft from "../assets/default_nft.jpg";
import CreateCollectionDialog from "../components/CreateCollectionDialog";
import CreateNftDialog from "../components/CreateNftDialog";
import Footer from "../components/Footer";
import NftDetailsDialog from "../components/NftDetailsDialog";
import { AccountContext } from "../context/AccountContext";
import { UIContext } from "../context/UIContext";
import { Web3Context } from "../context/Web3Context";

const NftButton = styled(Button)(() => ({
  borderRadius: "8px",
  "&:hover": {
    background: "none",
  },
}));

const NFTs = (): JSX.Element => {
  const { handleCreateCollectionUI, handleCreateNFTUI, handleNftDetailsUI } = useContext(UIContext);
  const { accountImported } = useContext(AccountContext);
  const { accountTokens, getAccountTokens, getNftDetails, nftDetails } = useContext(Web3Context);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pages] = useState<number>(0);

  const hidden = true;

  // const limitPerPage = 9;

  useEffect(() => {
    if (accountImported === true) {
      setIsWaiting(true);
      getAccountTokens();
      const updateAccountResources = window.setInterval(() => {
        getAccountTokens();
      }, 60000);
      return () => window.clearInterval(updateAccountResources);
    }
    return undefined;
  }, [accountImported]);

  useEffect(() => {
    if (accountImported && accountTokens.length > 0) {
      getNftDetails();
      setIsWaiting(false);
    } else if (accountTokens.length === 0) {
      setIsWaiting(false);
    }
  }, [accountTokens]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = async (_event: any, newPage: number): Promise<void> => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xs">
      <Stack
        sx={{
          mt: "90px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Button sx={{ width: "160px", mr: 2 }} variant="outlined" onClick={handleCreateCollectionUI}>
          <Typography align="center">Create Collection</Typography>
        </Button>
        <Button sx={{ width: "160px" }} variant="outlined" onClick={handleCreateNFTUI}>
          <Typography align="center">Create NFT</Typography>
        </Button>
      </Stack>
      {isWaiting === true && accountImported && (
        <Stack direction="column" sx={{ display: "flex", alignItems: "center", mt: 8, mb: "225px" }}>
          <Typography align="center" variant="h6" color="textSecondary" gutterBottom>
            Updating metadata...
          </Typography>
          <CircularProgress sx={{ mt: 4 }} color="info" />
        </Stack>
      )}
      {accountTokens.length === 0 && isWaiting === false && (
        <Typography sx={{ mt: 8, mb: "320px" }} variant="h6" align="center" color="textPrimary" gutterBottom>
          No NFTs found
        </Typography>
      )}
      {accountTokens.length > 0 && !isWaiting && accountImported && (
        <Stack sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ height: "340px", mb: "28px" }}>
            <ImageList
              gap={18}
              cols={3}
              rowHeight={101}
              variant="quilted"
              sx={{
                overflow: "hidden",
                overflowY: "visible",
                width: "338px",
                maxHeight: "340px",
              }}
            >
              {nftDetails.map((nft) => (
                <ImageListItem key={nft.name + nft.description + nft.uri}>
                  <Tooltip title={nft.name}>
                    <NftButton
                      disableRipple
                      sx={{ width: "100px", height: "100px" }}
                      onClick={() => handleNftDetailsUI(nft)}
                    >
                      <Paper
                        component="img"
                        sx={{ width: "100px", height: "100px" }}
                        src={`${nft.uri}`}
                        loading="lazy"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = default_nft;
                        }}
                      />
                    </NftButton>
                  </Tooltip>
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Stack>
      )}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {accountTokens !== 0 && !isWaiting && accountImported && hidden && <Box sx={{ mb: "32px" }} />}
        {accountTokens !== 0 && !isWaiting && accountImported && !hidden && (
          <Pagination
            count={pages}
            page={page}
            siblingCount={0}
            boundaryCount={1}
            variant="text"
            size="medium"
            shape="circular"
            onChange={handlePageChange}
          />
        )}
      </Box>
      {accountImported && <Footer />}
      <CreateCollectionDialog />
      <CreateNftDialog />
      <NftDetailsDialog />
    </Container>
  );
};

export default NFTs;
