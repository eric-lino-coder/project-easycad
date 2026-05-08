"use client";

import { useState } from "react";

import { Dialog, Snackbar, Alert } from "@mui/material";

import { z } from "zod";
import { backendUrl } from "../../lib/api";
import axiosApi from "../../axios";
import ModalForm from "./FormRoles";

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  role?: any;
}

interface RoleForm {
  name: string;
  description: string;
  is_active: boolean;
}

const roleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(20, "Descrição é Obrigatório"),
});

export default function ModalCreateRole({ isOpen, onClose, role }: Props) {
  const [form, setForm] = useState<RoleForm>({
    name: "",
    description: "",
    is_active: true,
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

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const result = roleSchema.safeParse(form);
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
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      };

      await axiosApi.post(backendUrl(`/api/roles`), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showSnackbar("Perfil atualizado com sucesso.", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Erro ao atualizar perfil.", "error");
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
        <ModalForm
          tituloModal={"EDITAR PERFIL"}
          role={role}
          onClose={onClose}
          form={form}
          getErrorProps={getErrorProps}
          handleChange={handleChange}
          handleSalvar={handleSalvar}
        />
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
