"use client";

/**
 * Layout content with navigation structure
 * Client component that contains AppBar, Drawer, and main content area
 */

import { ReactNode } from "react";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
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

const DRAWER_WIDTH = 240;

interface LayoutContentProps {
  children: ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* HEADER */}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            EASYCAD
          </Typography>
          <IconButton color="inherit" aria-label="user profile">
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Usuários" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px",
          overflow: "auto",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f4f6f8",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
