"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Typography,
  Button,
  Paper,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v7 (size/xs via componente Grid)
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCadastro from "./components/ModalCadastro";
import ModalEditUser from "./components/ModalUpdateUser";
import { backendUrl } from "./lib/api";

export default function Page() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);
  const [modoModal, setModoModal] = useState<"create" | "edit">("create");
  const [confirmarExclusaoAberto, setConfirmarExclusaoAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<any>(null);
  const [page, setPage] = useState(1);

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

  const rowsPerPage = 10; // 10 cards por página
  const totalPages = Math.max(1, Math.ceil(usuarios.length / rowsPerPage));
  const usuariosExibidos = usuarios.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl("/api/contatos"), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Falha ao buscar usuários");
      const data = await response.json();
      setUsuarios(data.contatos || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleEditarUsuario = (user: any) => {
    setUsuarioSelecionado(user);
    setModoModal("edit");
    setModalAberto(true);
  };

  const handleClickExcluir = (user: any) => {
    setUsuarioParaExcluir(user);
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
    try {
      const response = await fetch(
        backendUrl(`/api/contatos/${usuarioParaExcluir.id}`),
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Falha ao excluir usuário");
      }
      handleCancelarExclusao();
      carregarUsuarios();
      showSnackbar("Usuário excluído com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      showSnackbar("Erro ao excluir usuário. Tente novamente.", "error");
    }
  };

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
        {/* CABEÇALHO DO CARD */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setModoModal("create");
              setUsuarioSelecionado(null);
              setModalAberto(true);
            }}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* RÓTULOS DAS COLUNAS (HEADER DA LISTA) */}
        <Box sx={{ px: 2, py: 1, backgroundColor: "#f5f5f5" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                NOME
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                CPF
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                E-MAIL
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12, md: 2 }}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                AÇÕES
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* LISTA DE CARDS ZEBRADOS */}
        <Box sx={{ p: 2, flex: 1, overflow: "hidden" }}>
          {usuariosExibidos.length > 0 ? (
            usuariosExibidos.map((user, index) => (
              <Box
                key={user.id ?? index}
                sx={{
                  p: 1.5,
                  mb: 1.2,
                  borderRadius: "10px",
                  backgroundColor: index % 2 === 0 ? "#2E578C" : "#e0e0e0",
                  color: index % 2 === 0 ? "#fff" : "#333",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "0.2s",
                  "&:hover": { opacity: 0.9, transform: "scale(1.002)" },
                }}
              >
                <Grid container spacing={2} alignItems="center" sx={{ px: 2 }}>
                  {/* COLUNA NOME */}
                  <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        textTransform: "uppercase", // <--- ADICIONE ESTA LINHA
                      }}
                    >
                      {user.nome}
                    </Typography>
                  </Grid>

                  {/* COLUNA CPF */}
                  <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      {user.cpf}
                    </Typography>
                  </Grid>

                  {/* COLUNA E-MAIL */}
                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Grid>

                  {/* COLUNA AÇÕES */}
                  <Grid
                    size={{ xs: 12, sm: 12, md: 2 }}
                    sx={{ textAlign: { xs: "left", md: "right" } }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: "inherit" }}
                        onClick={() => handleEditarUsuario(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "inherit" }}
                        aria-label="Excluir usuário"
                        onClick={() => handleClickExcluir(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography color="textSecondary">
                Nenhum usuário encontrado.
              </Typography>
            </Box>
          )}
        </Box>

        {/* RODAPÉ COM PAGINAÇÃO MUI ALINHADA À DIREITA */}
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
          <Typography variant="body2" sx={{ color: "#666" }}>
            Exibindo {usuariosExibidos.length} de {usuarios.length} usuários
          </Typography>

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
        </Box>
      </Paper>

      <ModalCadastro
        isOpen={modalAberto && modoModal === "create"}
        onClose={handleFecharModal}
      />

      <ModalEditUser
        isOpen={modalAberto && modoModal === "edit"}
        onClose={handleFecharModal}
        usuario={usuarioSelecionado}
      />

      <Dialog
        open={confirmarExclusaoAberto}
        onClose={handleCancelarExclusao}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirmação</DialogTitle>
        <DialogContent>
          <Typography>você gostaria de excluir esse usuario?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleConfirmarExclusao}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#c62828" },
              textTransform: "none",
            }}
          >
            Sim
          </Button>
          <Button
            variant="contained"
            onClick={handleCancelarExclusao}
            sx={{
              backgroundColor: "#90a4ae",
              color: "#fff",
              "&:hover": { backgroundColor: "#78909c" },
              textTransform: "none",
            }}
          >
            Cancelar
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
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 520,
          },
        }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
