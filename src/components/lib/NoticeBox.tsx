import WarningIcon from "@mui/icons-material/Warning";
import { Box, DialogContent, Stack, Typography } from "@mui/material";

interface NoticeBoxProps {
  mt: string | number;
  width: string | number;
  text: string;
}

const NoticeBox = (props: NoticeBoxProps): JSX.Element => {
  return (
    <Box component={DialogContent} sx={{ mt: props.mt, border: 2, borderColor: "warning.light" }}>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: "-12px",
          mb: "-12px",
          width: props.width,
        }}
      >
        <WarningIcon color="warning" sx={{ fontSize: "24px", ml: "-12px", mr: "12px" }} />
        <Typography align="left">{props.text}</Typography>
      </Stack>
    </Box>
  );
};

export default NoticeBox;
