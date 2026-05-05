import axiosApi from "@/app/axios";
import axios from "axios";

export interface LoginResponse {
  token?: string;
  erro?: string;
}

export async function login(email: string, senha: string): Promise<string> {
  // pegar o token que esta salvo nos cookies do frontend

  // const token = ???

  // enviar o token como bearer token no header da requisição

  const response = await axiosApi.post(
    "/login",
    { email, password: senha },
    {
      withCredentials: true,
    },
  );

  const data = response.data;

  if (data.token) {
    localStorage.setItem("authToken", data.token);
    return data.token;
  }

  throw new Error(data.erro ?? "Falha desconhecida");
}
