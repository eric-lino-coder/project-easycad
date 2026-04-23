/**
 * Header component for users list
 */

import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface UserListHeaderProps {
  onAddUser: () => void;
}

export default function UserListHeader({ onAddUser }: UserListHeaderProps) {
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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddUser}
        sx={{ borderRadius: 2 }}
      >
        Novo Usuário
      </Button>
    </Box>
  );
}
