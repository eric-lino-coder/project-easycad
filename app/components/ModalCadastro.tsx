"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"; // Usando Grid2 para suporte ao 'size' do MUI v6
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
import CloseIcon from "@mui/icons-material/Close";

import {
  maskCPF,
  validarCPF,
  validarEmail,
  maskCEP,
  maskTelefone,
  maskApenasLetras,
  maskApenasNumeros,
} from "./masks";

interface ModalProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function ModalCadastro({ isOpen, onClose }: ModalProps) {
  const initialState = {
    nome: "",
    cpf: "",
    nascimento: "",
    rg: "",
    sexo: "",
    estadoCivil: "",
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    celular: "",
    fixo: "",
    email: "",
    linkedin: "",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbar = (message: string, severity: any) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      "pais",
      "estado",
      "cidade",
      "bairro",
      "cep",
      "logradouro",
      "numero",
      "celular",
      "email",
    ];

    camposObrigatorios.forEach((campo) => {
      const valor = form[campo as keyof typeof initialState];
      if (!valor || valor.trim() === "") {
        newErrors[campo] = "Campo obrigatório";
      }
    });

    // 2. Validação Matemática do CPF
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
    // Impede o salvamento se houver erros (incluindo CPF falso)
    if (!validateForm()) {
      showSnackbar("Verifique os campos obrigatórios ou inválidos.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showSnackbar("Usuário criado com sucesso.", "success");
      setTimeout(() => onClose(true), 1500);
    } catch {
      showSnackbar("Erro ao criar usuário no servidor.", "error");
    }
  };

  const getErrorProps = (field: string) => ({
    error: !!errors[field],
    helperText: errors[field],
  });

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
    }
  }, [isOpen]);

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
          NOVO USUÁRIO
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
                value={form.nome}
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
                value={form.cpf}
                {...getErrorProps("cpf")}
                onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="RG (Opcional)"
                value={form.rg}
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
                InputLabelProps={{ shrink: true }}
                value={form.nascimento}
                {...getErrorProps("nascimento")}
                onChange={(e) => handleChange("nascimento", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                select
                fullWidth
                label="Sexo"
                value={form.sexo}
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
                value={form.estadoCivil}
                {...getErrorProps("estadoCivil")}
                onChange={(e) => handleChange("estadoCivil", e.target.value)}
              >
                <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="E-mail"
                placeholder="exemplo@email.com"
                value={form.email}
                {...getErrorProps("email")}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Celular"
                value={form.celular}
                {...getErrorProps("celular")}
                onChange={(e) =>
                  handleChange("celular", maskTelefone(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Fixo (Opcional)"
                value={form.fixo}
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
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="CEP"
                value={form.cep}
                {...getErrorProps("cep")}
                onChange={(e) => handleChange("cep", maskCEP(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Logradouro"
                value={form.logradouro}
                {...getErrorProps("logradouro")}
                onChange={(e) => handleChange("logradouro", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }}>
              <TextField
                fullWidth
                label="Nº"
                value={form.numero}
                {...getErrorProps("numero")}
                onChange={(e) =>
                  handleChange("numero", maskApenasNumeros(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Bairro"
                value={form.bairro}
                {...getErrorProps("bairro")}
                onChange={(e) => handleChange("bairro", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Cidade"
                value={form.cidade}
                {...getErrorProps("cidade")}
                onChange={(e) => handleChange("cidade", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Estado"
                value={form.estado}
                {...getErrorProps("estado")}
                inputProps={{ maxLength: 2 }}
                onChange={(e) =>
                  handleChange("estado", e.target.value.toUpperCase())
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Complemento (Opcional)"
                value={form.complemento}
                onChange={(e) => handleChange("complemento", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Pais"
                value={form.pais}
                {...getErrorProps("pais")}
                onChange={(e) =>
                  handleChange("pais", maskApenasLetras(e.target.value))
                }
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
                value={form.linkedin}
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
            Salvar Usuário
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
