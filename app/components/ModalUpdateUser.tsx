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
import { z } from "zod";
import { backendUrl } from "../lib/api";
import {
  maskCPF,
  maskCEP,
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

interface UserForm {
  id: string;
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
  nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
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
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z
    .string()
    .min(1, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 letras"),
  complemento: z.string().optional(),
  pais: z.string().min(1, "País é obrigatório"),
  linkedin: z.string().min(1, "LinkedIn é obrigatório"),
});

export default function ModalEditUser({ isOpen, onClose, usuario }: Props) {
  const [form, setForm] = useState<UserForm>({
    id: "",
    nome: "",
    cpf: "",
    rg: "",
    nascimento: "",
    sexo: "",
    estadoCivil: "",
    email: "",
    celular: "",
    fixo: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
    pais: "",
    linkedin: "",
  });
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

  useEffect(() => {
    if (isOpen && usuario) {
      setForm({
        ...usuario,

        sexo:
          usuario.sexo === "M"
            ? "Masculino"
            : usuario.sexo === "F"
              ? "Feminino"
              : "",

        estadoCivil:
          usuario.estadocivil === "S"
            ? "Solteiro(a)"
            : usuario.estadocivil === "C"
              ? "Casado(a)"
              : usuario.estadocivil === "V"
                ? "Viúvo(a)"
                : "",

        nascimento: usuario.nascimento?.split("T")[0],
      });
      setErrors({});
    }
  }, [isOpen, usuario]);

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
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
    if (!validateForm()) {
      showSnackbar("Verifique os campos obrigatórios ou inválidos.", "warning");
      return;
    }

    try {
      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        nascimento: form.nascimento,
        rg: form.rg,
        sexo: form.sexo === "Masculino" ? "M" : "F",
        estadoCivil: form.estadoCivil?.[0],
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

      const res = await fetch(backendUrl(`/api/contatos/${form.id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      showSnackbar("Usuário atualizado com sucesso.", "success");
      setTimeout(() => onClose(true), 1500);
    } catch (error) {
      console.error(error);
      showSnackbar("Erro ao atualizar usuário.", "error");
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
                value={form.nascimento || ""}
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
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="País"
                value={form.pais || ""}
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
