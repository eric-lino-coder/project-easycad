/**
 * Types and interfaces for EasyCAD application
 */

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  endereco?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export type ModalMode = "create" | "edit";
