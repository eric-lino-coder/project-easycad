"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  MenuItem,
} from "@mui/material";

import Grid from "@mui/material/Grid"; // Usando Grid para suporte ao 'size' do MUI v6
import CloseIcon from "@mui/icons-material/Close";
import {
  maskCPF,
  maskCEP,
  validarEmail,
  validarCPF,
  maskTelefone,
  maskApenasLetras,
  maskApenasNumeros,
} from "./masks";

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  usuario?: any;
}

export default function ModalEditUser({ isOpen, onClose, usuario }: Props) {
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbar = (message: string, severity: any) => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (isOpen && usuario) {
      setForm({ ...usuario });
      setErrors({});
    }
  }, [isOpen, usuario]);

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 1. Campos obrigatórios
    const camposObrigatorios = [
      "nome",
      "cpf",
      "nascimento",
      "sexo",
      "estadoCivil",
      "email",
      "celular",
      "cep",
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "linkedin",
    ];

    camposObrigatorios.forEach((campo) => {
      if (!form[campo] || form[campo].toString().trim() === "") {
        newErrors[campo] = "Campo obrigatório";
      }
    });

    // 2. VALIDADOR MATEMÁTICO DE CPF (Adicionado)
    if (form.cpf && !newErrors.cpf) {
      if (!validarCPF(form.cpf)) {
        newErrors.cpf = "CPF inválido";
      }
    }

    // 3. Validação de E-mail
    if (form.email && !newErrors.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "E-mail inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validateForm()) {
      showSnackbar("Verifique os campos obrigatórios ou inválidos.", "warning");
      return;
    }

    try {
      // Ajustado para PUT e enviando os dados do formulário
      const res = await fetch(`/api/usuarios`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showSnackbar("Dados atualizados com sucesso.", "success");
      setTimeout(() => onClose(true), 1500);
    } catch {
      showSnackbar("Erro ao atualizar dados no servidor.", "error");
    }
  };

  const getErrorProps = (field: string) => ({
    error: !!errors[field],
    helperText: errors[field],
  });

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => onClose(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle sx={{ background: "#1A4173", color: "#fff", mb: 2 }}>
          EDITAR USUÁRIO: {usuario?.nome?.toUpperCase()}
          <IconButton
            onClick={() => onClose(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", color: "#1A4173" }}
          >
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={form.nome || ""}
                {...getErrorProps("nome")}
                onChange={(e) =>
                  handleChange("nome", maskApenasLetras(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="CPF"
                value={form.cpf || ""}
                {...getErrorProps("cpf")}
                onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="RG (Opcional)"
                value={form.rg || ""}
                onChange={(e) =>
                  handleChange("rg", maskApenasNumeros(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Data de Nascimento"
                value={form.nascimento || ""}
                {...getErrorProps("nascimento")}
                onChange={(e) => handleChange("nascimento", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                select
                fullWidth
                label="Sexo"
                value={form.sexo || ""}
                {...getErrorProps("sexo")}
                onChange={(e) => handleChange("sexo", e.target.value)}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                select
                fullWidth
                label="Est. Civil"
                value={form.estadoCivil || ""}
                {...getErrorProps("estadoCivil")}
                onChange={(e) => handleChange("estadoCivil", e.target.value)}
              >
                <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                value={form.email || ""}
                {...getErrorProps("email")}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Celular"
                value={form.celular || ""}
                {...getErrorProps("celular")}
                onChange={(e) =>
                  handleChange("celular", maskTelefone(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Fixo"
                value={form.fixo || ""}
                {...getErrorProps("fixo")}
                onChange={(e) =>
                  handleChange("fixo", maskTelefone(e.target.value))
                }
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", color: "#1A4173" }}
          >
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="CEP"
                value={form.cep || ""}
                {...getErrorProps("cep")}
                onChange={(e) => handleChange("cep", maskCEP(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                fullWidth
                label="Logradouro"
                value={form.logradouro || ""}
                {...getErrorProps("logradouro")}
                onChange={(e) => handleChange("logradouro", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Nº"
                value={form.numero || ""}
                {...getErrorProps("numero")}
                onChange={(e) => handleChange("numero", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Bairro"
                value={form.bairro || ""}
                {...getErrorProps("bairro")}
                onChange={(e) => handleChange("bairro", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Cidade"
                value={form.cidade || ""}
                {...getErrorProps("cidade")}
                onChange={(e) => handleChange("cidade", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Estado"
                value={form.estado || ""}
                {...getErrorProps("estado")}
                onChange={(e) =>
                  handleChange("estado", e.target.value.toUpperCase())
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Complemento"
                value={form.complemento || ""}
                onChange={(e) => handleChange("complemento", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", color: "#1A4173" }}
          >
            Redes Sociais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={form.linkedin || ""}
                {...getErrorProps("linkedin")}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => onClose(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            variant="contained"
            sx={{ background: "#1A4173" }}
          >
            Salvar Alterações
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
          "& .MuiAlert-root": { width: "100%", maxWidth: 520 },
        }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
