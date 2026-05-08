"use client";

import { useEffect, useState, ReactNode } from "react";
import { Box, Paper, Pagination, Snackbar, Alert } from "@mui/material";
import ModalCadastro from "../../components/users/ModalCadastro";
import ModalEditRole from "../../components/roles/ModalUpdateRole";
import RoleListRows from "../../components/roles/RoleListRows";
import { useRoles } from "../../hooks/useRoles";
import { Role } from "../../types";
import { ModalProvider, useModal } from "../../contexts/ModalContext";
import ModalCreateRole from "@/app/components/roles/ModalCreateRole";

const ROWS_PER_PAGE = 10;

interface RolesInnerProps {
  header: ReactNode;
  roles: Role[];
  snackbar: ReturnType<typeof useRoles>["snackbar"];
  closeSnackbar: () => void;
  excluirRole: (id: string | number) => Promise<void>;
}

function RolesInner({
  header,
  roles,
  snackbar,
  closeSnackbar,
  excluirRole,
}: RolesInnerProps) {
  const { abrirEditar, modalAberto, modoModal, valorSelecionado, fechar } =
    useModal();

  const [confirmarExclusaoAberto, setConfirmarExclusaoAberto] = useState(false);
  const [roleParaExcluir, setRoleParaExcluir] = useState<Role | null>(null);
  const [page, setPage] = useState(1);

  const handleClickExcluir = (role: Role) => {
    setRoleParaExcluir(role);
    setConfirmarExclusaoAberto(true);
  };

  const handleCancelarExclusao = () => {
    setConfirmarExclusaoAberto(false);
    setRoleParaExcluir(null);
  };

  const handleConfirmarExclusao = async () => {
    if (!roleParaExcluir?.id) return;
    await excluirRole(roleParaExcluir.id);
    handleCancelarExclusao();
  };

  const totalPages = Math.max(1, Math.ceil(roles.length / ROWS_PER_PAGE));
  const rolesExibidos = roles.slice(
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

        <RoleListRows roles={rolesExibidos} onEdit={abrirEditar} />

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
            Exibindo {rolesExibidos.length} de {roles.length} Perfils
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

      <ModalCreateRole
        isOpen={modalAberto && modoModal === "create"}
        onClose={fechar}
      />

      <ModalEditRole
        isOpen={modalAberto && modoModal === "edit"}
        onClose={fechar}
        role={valorSelecionado}
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

interface RolesContentProps {
  header: ReactNode;
}

export default function RolesContent({ header }: RolesContentProps) {
  const { roles, snackbar, carregarRoles, excluirRole, closeSnackbar } =
    useRoles();

  useEffect(() => {
    carregarRoles();
  }, [carregarRoles]);

  return (
    <ModalProvider onAtualizar={carregarRoles}>
      <RolesInner
        header={header}
        roles={roles}
        snackbar={snackbar}
        closeSnackbar={closeSnackbar}
        excluirRole={async () => {}}
      />
    </ModalProvider>
  );
}
