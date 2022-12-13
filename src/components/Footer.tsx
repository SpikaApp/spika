/* eslint-disable @typescript-eslint/no-non-null-assertion */
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { AccountContext } from "../context/AccountContext";
import { getNetworkString } from "../utils/getNetworkString";
import { IExplorerNetwork } from "../interface";

const Footer = (): JSX.Element => {
  const { currentAddress, currentNetwork } = useContext(AccountContext);
  const [network, setNetwork] = useState<IExplorerNetwork>("mainnet");

  useEffect(() => {
    if (currentNetwork) {
      const networkString = getNetworkString(currentNetwork!.name);
      setNetwork(networkString);
    }
  }, [currentNetwork]);

  return (
    <Typography sx={{ mt: 2 }} variant="subtitle1" align="center" color="textPrimary">
      View account in{" "}
      <Link
        href={`https://explorer.aptoslabs.com/account/${currentAddress}?network=${network}`}
        underline="none"
        target="_blank"
        color="link"
      >
        Aptos Explorer <OpenInNewIcon sx={{ fontSize: 16 }} />
      </Link>
    </Typography>
  );
};

export default Footer;
