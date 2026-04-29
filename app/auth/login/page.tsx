"use client";

import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#23578C",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Iceland&display=swap');
      </style>

      {isMobile && (
        <img
          src="/login-left.svg"
          alt=""
          style={{ position: "absolute", left: 0, top: 0, height: "100%" }}
        />
      )}
      <img
        src="/login-right.svg"
        alt=""
        style={{ position: "absolute", right: 0, top: 0, height: "100%" }}
      />
      <Box
        // Box com estilo de vidro fosco (glassmorphism) para o formulário de login
        sx={{
          height: 450,
          width: 500,
          borderRadius: 2,
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          // Box para o logo e título do login, centralizado e com estilo de texto personalizado
          sx={{
            height: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/logo-ec.svg"
            alt="Logo"
            style={{
              display: "block",
              margin: "40px auto 10px auto",
              height: 30,
            }}
          ></img>
          <h1
            // Título "Login" com a fonte Iceland e estilo de texto personalizado
            style={{
              margin: 0,
              fontFamily: "Iceland, sans-serif",
              fontWeight: 200,
              fontStyle: "normal",
              fontSize: 40,
            }}
          >
            Login
          </h1>
        </Box>
        <Box
          // Box para os campos de email e senha, com espaçamento entre eles e largura ajustada para o formulário
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            marginBottom: 6,
          }}
        >
          <TextField label="Email" variant="outlined" sx={{ width: "100%" }} />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={{ width: "100%" }}
          />
          <Button
            variant="contained"
            sx={{ width: "60%", backgroundColor: "#3E8A00" }}
          >
            Entrar
            <img
              src="/icon-login.svg"
              alt="Login"
              style={{ position: "absolute", right: 8 }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
