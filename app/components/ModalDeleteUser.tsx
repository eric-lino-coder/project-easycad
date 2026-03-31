"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  usuario?: any;
}

export default function ModalDelete({ isOpen, onClose, usuario }: Props) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleDelete = async () => {
    // 1° Verifica se existe o ID do usuário
    if (!usuario?.id) {
      console.error("ID do usuário não encontrado.");
      return;
    }

    setLoading(true);
    try {
      // 2° Faz a chamada DELETE enviando o ID na URL
      const res = await fetch(`/api/usuarios?id=${usuario.id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Falha na requisição");

      setSnackbar({
        open: true,
        message: "Usuário deletado com sucesso!",
        severity: "success",
      });

      // 3°Aguarda o feedback visual antes de fechar o modal
      setTimeout(() => {
        onClose(true); // O parâmetro 'true' avisa o componente pai para recarregar a lista
      }, 1000);
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar usuário.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => !loading && onClose(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirmação</DialogTitle>

        <DialogContent>
          <Typography>
            Você realmente deseja deletar o usuário{" "}
            <strong>{usuario?.nome}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => onClose(false)}
            disabled={loading}
            sx={{ color: "#757575" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#c62828" },
            }}
          >
            {loading ? "Deletando..." : "Sim, Deletar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 24,
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 520,
          },
        }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
