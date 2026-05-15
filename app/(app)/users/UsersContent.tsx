"use client";

import { useEffect, useState, ReactNode } from "react";
import { Box, Paper, Pagination, Snackbar, Alert } from "@mui/material";
import ModalEditUser from "../../components/users/ModalUpdateUser";
import UserListRows from "../../components/users/UserListRows";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import { useUsuarios } from "../../hooks/useUsuarios";
import { Usuario } from "../../types";
import { ModalProvider, useModal } from "../../contexts/ModalContext";
import ModalCadastro from "@/app/components/users/ModalCadastro";

const ROWS_PER_PAGE = 10;

interface UsersInnerProps {
  header: ReactNode;
  usuarios: Usuario[];
  snackbar: ReturnType<typeof useUsuarios>["snackbar"];
  closeSnackbar: () => void;
  excluirUsuario: (id: string | number) => Promise<void>;
}

function UsersInner({
  header,
  usuarios,
  snackbar,
  closeSnackbar,
  excluirUsuario,
}: UsersInnerProps) {
  const { abrirEditar, modalAberto, modoModal, valorSelecionado, fechar } =
    useModal();

  const [confirmarExclusaoAberto, setConfirmarExclusaoAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const handleClickExcluir = (usuario: Usuario) => {
    setUsuarioParaExcluir(usuario);
    setConfirmarExclusaoAberto(true);
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
        {/* header é um elemento Server Component passado por page.tsx */}
        {header}

        <UserListRows
          usuarios={usuariosExibidos}
          onEdit={abrirEditar}
          onDelete={handleClickExcluir}
        />

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

      <ModalCadastro
        isOpen={modalAberto && modoModal === "create"}
        onClose={fechar}
      />
      <ModalEditUser
        isOpen={modalAberto && modoModal === "edit"}
        onClose={fechar}
        usuario={valorSelecionado}
      />

      <DeleteConfirmDialog
        open={confirmarExclusaoAberto}
        usuario={usuarioParaExcluir}
        onConfirm={handleConfirmarExclusao}
        onCancel={handleCancelarExclusao}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ "& .MuiAlert-root": { width: "100%", maxWidth: 520 } }}
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

interface UsersContentProps {
  header: ReactNode;
}

export default function UsersContent({ header }: UsersContentProps) {
  const {
    usuarios,
    snackbar,
    carregarUsuarios,
    excluirUsuario,
    closeSnackbar,
  } = useUsuarios();

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return (
    <ModalProvider onAtualizar={carregarUsuarios}>
      <UsersInner
        header={header}
        usuarios={usuarios}
        snackbar={snackbar}
        closeSnackbar={closeSnackbar}
        excluirUsuario={excluirUsuario}
      />
    </ModalProvider>
  );
}
