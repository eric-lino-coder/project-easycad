"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"; // Usando Grid2 para suporte ao 'size' do MUI v6
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import { backendUrl } from "../lib/api";

import {
  maskCPF,
  validarCPF,
  maskCEP,
  maskTelefone,
  maskApenasLetras,
  maskApenasNumeros,
} from "./masks";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  TextField,
  MenuItem,
  Divider,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
}

interface UserForm {
  nome: string;
  cpf: string;
  rg: string;
  nascimento: string;
  sexo: string;
  estadoCivil: string;
  email: string;
  celular: string;
  fixo: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
  pais: string;
  linkedin: string;
}

const userSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(validarCPF, "CPF inválido"),
  rg: z.string().optional(),
  nascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  sexo: z
    .string()
    .min(1, "Sexo é obrigatório")
    .refine((val) => ["Masculino", "Feminino"].includes(val), {
      message: "Sexo inválido",
    }),
  estadoCivil: z
    .string()
    .min(1, "Estado civil é obrigatório")
    .refine((val) => ["Solteiro(a)", "Casado(a)", "Viúvo(a)"].includes(val), {
      message: "Estado civil inválido",
    }),
  email: z.string().email("E-mail inválido"),
  celular: z.string().min(1, "Celular é obrigatório"),
  fixo: z.string().optional(),
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatório"),
  // Correção aqui: encadeamento contínuo
  estado: z
    .string()
    .min(1, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 letras"),

  complemento: z.string().optional(),
  pais: z.string().min(1, "País é obrigatório"),
  linkedin: z.string().url("LinkedIn inválido"),
});

export default function ModalCadastro({ isOpen, onClose }: ModalProps) {
  const initialState: UserForm = {
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

  const [form, setForm] = useState<UserForm>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSalvar = async () => {
    // Impede o salvamento se houver erros (incluindo CPF falso)
    if (!validateForm()) {
      showSnackbar("Verifique os campos obrigatórios ou inválidos.", "warning");
      return;
    }

    try {
      const res = await fetch(backendUrl("/api/contatos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      showSnackbar("Usuário criado com sucesso.", "success");
      setTimeout(() => onClose(true), 1500);
    } catch {
      showSnackbar("Erro ao criar usuário no servidor.", "error");
    }
  };

  const formatarData = (data: string) => {
    if (!data) return null;
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const payload = {
    nome: form.nome,
    cpf: form.cpf,
    nascimento: form.nascimento,
    rg: form.rg,
    sexo: form.sexo === "Masculino" ? "M" : "F",
    estadoCivil: form.estadoCivil?.[0], // S, C, etc
    pais: form.pais,
    estado: form.estado?.slice(0, 2).toUpperCase(),
    cidade: form.cidade,
    bairro: form.bairro,
    cep: form.cep,
    logradouro: form.logradouro,
    numero: form.numero,
    complemento: form.complemento,
    celular: form.celular,
    fixo: form.fixo,
    email: form.email,
    linkedin: form.linkedin,
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
                value={form.nascimento}
                {...getErrorProps("nascimento")}
                onChange={(e) => handleChange("nascimento", e.target.value)}
                slotProps={{
                  htmlInput: {
                    placeholder: "Data de Nascimento",
                  },
                }}
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
