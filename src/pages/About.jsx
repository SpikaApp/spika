import { useContext } from "react";
import {
  Container,
  Typography,
  Link,
  Card,
  Box,
  CardContent,
  CardActions,
  Stack,
  Button,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import spika_logo from "../assets/spika_logo_128.png";
import { AccountContext } from "../context/AccountContext";
import { UIContext } from "../context/UIContext";
import useAxios from "../utils/use_axios";
import { NODE_URL } from "../utils/constants";

const About = () => {
  const { accountImported } = useContext(AccountContext);
  const { handleMnemonicUI, handlePrivateKeyUI, darkMode } = useContext(UIContext);
  const { result: chain_id } = useAxios(NODE_URL, "chain_id");

  return (
    <Container maxWidth="xs">
      <Card sx={{ mb: 2, mt: "100px", minHeight: "400px" }}>
        <CardContent>
          <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
            <Link href="https://aptoslabs.com/" underline="none" target="_blank" color="link">
              Aptos
            </Link>{" "}
            Devnet chain id {chain_id}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textPrimary">
            Wallet version 0.3.4 <br />
            Aptos SDK version 1.3.7
            <br />
            <Link
              href="https://docs.spika.app/terms-and-conditions/license"
              underline="none"
              target="_blank"
              color="link"
            >
              {" "}
              License
            </Link>
            <br />
            <Link
              href="https://docs.spika.app/terms-and-conditions/privacy-policy"
              underline="none"
              target="_blank"
              color="link"
            >
              {" "}
              Privacy Policy
            </Link>
            <br />
            <Link href="mailto:support@spika.app" underline="none" target="_blank" color="link">
              Contacts
            </Link>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Link
                href="https://spika.app"
                color={darkMode ? "white" : "black"}
                underline="none"
                target="_blank"
              >
                <Box
                  sx={{ height: "48px", width: "48px", mr: 2 }}
                  component="img"
                  src={spika_logo}
                />
              </Link>
              <Link
                href="https://www.twitter.com/SpikaApp"
                color="#1DA1F2"
                underline="none"
                target="_blank"
              >
                <TwitterIcon sx={{ fontSize: 42 }} />
              </Link>
            </Stack>
          </Typography>
        </CardContent>
        <CardActions>
          {accountImported && (
            <Stack>
              <Button sx={{ mb: 2 }} variant="outlined" onClick={handleMnemonicUI}>
                Show Mnemonic
              </Button>
              <Button variant="outlined" onClick={handlePrivateKeyUI}>
                Show Private Key
              </Button>
            </Stack>
          )}
        </CardActions>
      </Card>
    </Container>
  );
};

export default About;
