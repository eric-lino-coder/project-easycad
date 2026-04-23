/**
 * Delete confirmation dialog for users
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Usuario } from "@/app/types";

interface DeleteConfirmDialogProps {
  open: boolean;
  usuario: Usuario | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  usuario,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirmação</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir o usuário{" "}
          <strong>{usuario?.nome}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": { backgroundColor: "#c62828" },
          }}
        >
          {isDeleting ? "Excluindo..." : "Confirmar"}
        </Button>
        <Button
          variant="contained"
          onClick={onCancel}
          disabled={isDeleting}
          sx={{
            backgroundColor: "#90a4ae",
            "&:hover": { backgroundColor: "#78909c" },
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
