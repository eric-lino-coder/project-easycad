"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useModal } from "../../contexts/ModalContext";

export default function NewUserButton() {
  const { abrirCriar } = useModal();

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={abrirCriar}
      sx={{ borderRadius: 2 }}
    >
      Novo Usuário
    </Button>
  );
}
