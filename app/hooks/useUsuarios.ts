/**
 * Hook customizado para gerenciar usuários
 */

import { useState, useCallback } from "react";
import { Usuario, SnackbarState } from "@/app/types";
import { BACKEND_BASE_URL, backendUrl } from "@/app/lib/api";
import axiosApi from "../axios";

interface UseUsuariosReturn {
  usuarios: Usuario[];
  loading: boolean;
  snackbar: SnackbarState;
  carregarUsuarios: () => Promise<void>;
  excluirUsuario: (id: string) => Promise<void>;
  showSnackbar: (message: string, severity: SnackbarState["severity"]) => void;
  closeSnackbar: () => void;
}

export function useUsuarios(): UseUsuariosReturn {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      if (!BACKEND_BASE_URL) {
        const errorMsg =
          "❌ Backend URL não configurada. Configure NEXT_PUBLIC_BASE_URL_BACK_END no arquivo .env.local";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      const apiUrl = backendUrl("/api/users");

      const response = await axiosApi.get(apiUrl);

      if (!response.data) {
        console.error(
          `❌ Erro ${response.status}:`,
          response.statusText,
          "URL:",
          apiUrl,
        );
        throw new Error(
          `Erro ${response.status}: ${response.statusText}. Backend disponível?`,
        );
      }

      const { data } = response;
      console.log("✅ Usuários carregados:", data.users?.length || 0);
      setUsuarios(data.users || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error(
        "%c❌ ERRO AO BUSCAR USUÁRIOS:",
        "color: red; font-weight: bold;",
        errorMessage,
      );
      console.log(
        "%c💡 Verifique:",
        "color: blue; font-weight: bold;",
        "\n1. Backend está rodando? (npm run dev no projeto backend)\n2. .env.local tem NEXT_PUBLIC_BASE_URL_BACK_END correto?\n3. URL do backend está acessível?\n4. Endpoint /api/users existe?",
      );
      setUsuarios([]);
      showSnackbar(`❌ Erro: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirUsuario = useCallback(
    async (id: string) => {
      try {
        const response = await axiosApi.delete(backendUrl(`/api/users/${id}`));

        await carregarUsuarios();
        showSnackbar("Usuário excluído com sucesso", "success");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        showSnackbar("Erro ao excluir usuário. Tente novamente.", "error");
      }
    },
    [carregarUsuarios],
  );

  const showSnackbar = useCallback(
    (message: string, severity: SnackbarState["severity"]) => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    usuarios,
    loading,
    snackbar,
    carregarUsuarios,
    excluirUsuario,
    showSnackbar,
    closeSnackbar,
  };
}
