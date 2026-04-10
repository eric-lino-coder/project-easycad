const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL_BACK_END;
export const BACKEND_BASE_URL = rawBaseUrl;

export const backendUrl = (path: string) =>
  `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
