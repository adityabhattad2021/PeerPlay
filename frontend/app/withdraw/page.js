"use client";
import CustomButton from "@/components/CustomButton";
import { useStateContext } from "@/context";
import { Box, Typography } from "@mui/material";

export default function Withdraw() {
  const { withdrawSupporterRevenueFunc, withdrawCreatorRevenueFunc } =
    useStateContext();
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: { sx: "calc(100vh - 80px)", md: "calc(100vh)" },
        marginLeft: { sx: 0, md: "13%" },
        marginTop: { sx: "80px", md: 0 },
        px: { sx: 2, md: 4 },
        overflow: "auto",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
        Withdraw
      </Typography>
      <Box
        sx={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <CustomButton
          onClick={withdrawCreatorRevenueFunc}
          className="stream-btn"
          text={"Withdraw as a creator"}
        />
        <CustomButton
          onClick={withdrawSupporterRevenueFunc}
          className="stream-btn"
          text={"Withdraw as a supporter"}
        />
      </Box>
    </Box>
  );
}
