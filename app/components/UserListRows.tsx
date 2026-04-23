/**
 * User list rows component
 */

import { Box, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Usuario } from "@/app/types";

interface UserListRowsProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const ROWS_PER_PAGE = 10;

export default function UserListRows({
  usuarios,
  onEdit,
  onDelete,
}: UserListRowsProps) {
  if (usuarios.length === 0) {
    return (
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
    );
  }

  return (
    <>
      {/* Column Headers */}
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

      {/* Rows */}
      <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
        {usuarios.map((user, index) => (
          <Box
            key={user.id}
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
            <Grid container spacing={2} sx={{ px: 2 }}>
              {/* Name Column */}
              <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                  }}
                >
                  {user.nome}
                </Typography>
              </Grid>

              {/* CPF Column */}
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography sx={{ fontSize: "0.9rem" }}>{user.cpf}</Typography>
              </Grid>

              {/* Email Column */}
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

              {/* Actions Column */}
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
                    onClick={() => onEdit(user)}
                    aria-label="Editar usuário"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "inherit" }}
                    onClick={() => onDelete(user)}
                    aria-label="Excluir usuário"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </>
  );
}
