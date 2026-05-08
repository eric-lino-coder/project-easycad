import { Box, Typography } from "@mui/material";
import NewUserButton from "./NewUserButton";

const PERMISSAO_CRIAR_USUARIO = true;

export default function UserListHeader() {
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
        Usuários
      </Typography>

      {PERMISSAO_CRIAR_USUARIO && <NewUserButton />}
    </Box>
  );
}
