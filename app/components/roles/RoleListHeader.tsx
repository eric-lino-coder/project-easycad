import { Box, Typography, Grid, IconButton } from "@mui/material";
import NewRoleButton from "./NewRoleButton";

const PERMISSAO_CRIAR_PERFIL = true;

export default function RoleListHeader() {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Perfis
      </Typography>

      {PERMISSAO_CRIAR_PERFIL && <NewRoleButton />}
    </Box>
  );
}
