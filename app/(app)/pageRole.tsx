"use client";

import { Box, Typography } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";

export default function PageRole() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
        color: "#9e9e9e",
      }}
    >
      <BadgeIcon sx={{ fontSize: 64 }} />
      <Typography variant="h6">Nenhum perfil cadastrado</Typography>
    </Box>
  );
}
