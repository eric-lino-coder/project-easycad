"use client"; // Adicione no topo para o ThemeProvider funcionar
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import theme from "./theme";
import { ThemeProvider } from "@emotion/react";
import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body style={{ overflow: "hidden" }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Isso aplica o reset de CSS do MUI */}
            <Box sx={{ display: "flex" }}>
              {/* HEADER */}
              <AppBar
                position="fixed"
                sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
              >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <Typography variant="h6">EASYCAD</Typography>
                  <IconButton
                    color="inherit"
                    sx={{ p: 0.5 }}
                    aria-label="usuário"
                  >
                    <AccountCircleIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Toolbar>
              </AppBar>

              {/* SIDEBAR */}
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                  },
                }}
              >
                <Toolbar /> {/* Espaçador para não cobrir o menu */}
                <List>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ color: "white" }}>
                      <ListItemIcon sx={{ color: "white" }}>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Usuários" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Drawer>

              {/* CONTEÚDO PRINCIPAL */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  mt: 8,
                  height: "calc(100vh - 64px)",
                  overflow: "hidden",
                }}
              >
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
