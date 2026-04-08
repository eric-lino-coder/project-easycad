"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A4173", // Azul padrão
    },
    background: {
      default: "#f4f6f8", // Cinza clarinho para o fundo do sistema
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#B1BBC7", // Cor escura para a sidebar (mais moderno)
          color: "#fff",
        },
      },
    },
  },
});

export default theme;
