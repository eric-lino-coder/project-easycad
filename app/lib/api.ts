/**
 * API client configuration and utilities
 */

type BaseUrl = string | undefined;

const rawBaseUrl: BaseUrl = process.env.NEXT_PUBLIC_BASE_URL_BACK_END;

export const BACKEND_BASE_URL: BaseUrl = rawBaseUrl;

/**
 * Constructs a full backend URL from a path
 * @param path - API endpoint path
 * @returns Complete backend URL
 * @throws Error if BACKEND_BASE_URL is not configured
 */
export const backendUrl = (path: string): string => {
  if (!BACKEND_BASE_URL) {
    const message =
      "NEXT_PUBLIC_BASE_URL_BACK_END environment variable is not configured";
    console.error(message);
    throw new Error(message);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${normalizedPath}`;
};

/**
 * HTTP request options with common defaults
 */
export const getDefaultFetchOptions = (
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
): RequestInit => {
  const options: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  return options;
};
