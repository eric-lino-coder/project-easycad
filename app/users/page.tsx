"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Pagination, Snackbar, Alert } from "@mui/material";
import ModalCadastro from "../components/ModalCadastro";
import ModalEditUser from "../components/ModalUpdateUser";
import UserListHeader from "../components/UserListHeader";
import UserListRows from "../components/UserListRows";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useUsuarios } from "../hooks/useUsuarios";
import { Usuario, ModalMode } from "../types";

const ROWS_PER_PAGE = 10;

export default function Page() {
  // State management
  const {
    usuarios,
    loading,
    snackbar,
    carregarUsuarios,
    excluirUsuario,
    closeSnackbar,
  } = useUsuarios();
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null,
  );
  const [modoModal, setModoModal] = useState<ModalMode>("create");
  const [confirmarExclusaoAberto, setConfirmarExclusaoAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(
    null,
  );
  const [page, setPage] = useState(1);

  // Load usuarios on component mount
  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  // Handlers
  const handleAbrirNovoUsuario = () => {
    setModoModal("create");
    setUsuarioSelecionado(null);
    setModalAberto(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModoModal("edit");
    setModalAberto(true);
  };

  const handleClickExcluir = (usuario: Usuario) => {
    setUsuarioParaExcluir(usuario);
    setConfirmarExclusaoAberto(true);
  };

  const handleFecharModal = (atualizar = false) => {
    setModalAberto(false);
    setUsuarioSelecionado(null);
    setModoModal("create");
    if (atualizar) {
      carregarUsuarios();
    }
  };

  const handleCancelarExclusao = () => {
    setConfirmarExclusaoAberto(false);
    setUsuarioParaExcluir(null);
  };

  const handleConfirmarExclusao = async () => {
    if (!usuarioParaExcluir?.id) return;
    await excluirUsuario(usuarioParaExcluir.id);
    handleCancelarExclusao();
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(usuarios.length / ROWS_PER_PAGE));
  const usuariosExibidos = usuarios.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Paper
        elevation={2}
        sx={{
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <UserListHeader onAddUser={handleAbrirNovoUsuario} />

        {/* List Rows */}
        <UserListRows
          usuarios={usuariosExibidos}
          onEdit={handleEditarUsuario}
          onDelete={handleClickExcluir}
        />

        {/* Footer with Pagination */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ fontSize: "0.875rem", color: "#666" }}>
            Exibindo {usuariosExibidos.length} de {usuarios.length} usuários
          </Box>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Modals */}
      <ModalCadastro
        isOpen={modalAberto && modoModal === "create"}
        onClose={handleFecharModal}
      />

      <ModalEditUser
        isOpen={modalAberto && modoModal === "edit"}
        onClose={handleFecharModal}
        usuario={usuarioSelecionado}
      />

      <DeleteConfirmDialog
        open={confirmarExclusaoAberto}
        usuario={usuarioParaExcluir}
        onConfirm={handleConfirmarExclusao}
        onCancel={handleCancelarExclusao}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 520,
          },
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
