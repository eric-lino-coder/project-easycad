import axios from "axios";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BACK_END,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isAuthRequest && typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default axiosApi;
