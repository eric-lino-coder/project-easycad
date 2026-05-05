"use client";

import axiosApi from "@/app/axios";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosApi.post("/api/auth/login", {
        email,
        password: senha,
      });
      router.push("/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403 || status === 422) {
          setErro("Usuário ou senha inválidos");
        } else if (!err.response) {
          setErro("Erro de conexão. Verifique sua internet.");
        } else {
          setErro("Erro ao fazer login. Tente novamente mais tarde.");
        }
      } else {
        setErro("Erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  }
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

      {!isMobile && (
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
        component="form"
        onSubmit={handleSubmit}
        sx={{
          minHeight: 450,
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
          />
          <h1
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
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            marginBottom: 6,
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ width: "100%" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            sx={{ width: "100%" }}
          />
          {erro && (
            <Alert severity="error" sx={{ width: "100%", borderRadius: 1 }}>
              {erro}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ width: "60%", backgroundColor: "#3E8A00" }}
          >
            {loading ? "Entrando..." : "Entrar"}
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
