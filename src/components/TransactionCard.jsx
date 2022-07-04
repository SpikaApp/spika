import React from "react";
import { ListItem, Divider, Stack, Tooltip, Typography, Link } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const TransactionCard = ({ transaction: { gas_used, version, status, vm_status } }) => {
  return (
    <div className="transaction">
      <ListItem>
        <FileUploadIcon sx={{ fontSize: 24, marginRight: 2, marginTop: 1 }} color="primary" />
        <Stack>
          <Stack sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Stack direction="row">
              <Typography sx={{ mr: 0.5 }}>Transaction: </Typography>
              <Tooltip title="Open in Aptos Explorer">
                <Link
                  href={`https://explorer.devnet.aptos.dev/txn/${version}`}
                  target="_blank"
                  underline="none"
                >
                  {version} <OpenInNewIcon sx={{ fontSize: 16 }} />
                </Link>
              </Tooltip>
            </Stack>
            Gas used: {gas_used}
            <br />
            Status: {vm_status}
          </Stack>
        </Stack>
      </ListItem>
      <Divider />
    </div>
  );
};

export default TransactionCard;
