const rawBaseUrl = process.env.BASE_URL_BACK_END ?? "http://localhost:5000";
export const BACKEND_BASE_URL = rawBaseUrl.replace(/\/+$|^\s+|\s+$/g, "");

export const backendUrl = (path: string) =>
  `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
