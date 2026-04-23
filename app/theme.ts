/**
 * Material-UI Theme Configuration
 * Defines the visual design system for EasyCAD application
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A4173", // Primary brand color
    },
    secondary: {
      main: "#B1BBC7", // Secondary color for sidebar and accents
    },
    background: {
      default: "#f4f6f8", // Light background for main content area
      paper: "#FFFFFF", // Card and paper backgrounds
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#B1BBC7",
          color: "#FFFFFF",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

export default theme;
