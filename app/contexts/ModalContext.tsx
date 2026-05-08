"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Usuario, Role, ModalMode } from "../types";

interface ModalContextValue {
  modalAberto: boolean;
  modoModal: ModalMode;
  valorSelecionado: Usuario | Role | null;
  abrirCriar: () => void;
  abrirEditar: (valor: Usuario | Role) => void;
  fechar: (atualizar?: boolean) => void;
  onAtualizarLista: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}

interface ModalProviderProps {
  children: ReactNode;
  onAtualizar: () => void;
}

export function ModalProvider({ children, onAtualizar }: ModalProviderProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState<ModalMode>("create");
  const [valorSelecionado, setValorSelecionado] = useState<
    Usuario | Role | null
  >(null);

  const abrirCriar = () => {
    setModoModal("create");
    setValorSelecionado(null);
    setModalAberto(true);
  };

  const abrirEditar = (valor: Usuario | Role) => {
    setValorSelecionado(valor);
    setModoModal("edit");
    setModalAberto(true);
  };

  const fechar = (atualizar = false) => {
    setModalAberto(false);
    setValorSelecionado(null);
    setModoModal("create");
    if (atualizar) onAtualizar();
  };

  return (
    <ModalContext.Provider
      value={{
        modalAberto,
        modoModal,
        valorSelecionado,
        abrirCriar,
        abrirEditar,
        fechar,
        onAtualizarLista: onAtualizar,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
