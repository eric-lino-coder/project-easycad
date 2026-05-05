import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/login"];

function isTokenValid(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const { exp } = JSON.parse(atob(padded));
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = token ? isTokenValid(token) : false;
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthenticated && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.png|.*\\.svg|.*\\.png|.*\\.ico).*)",
  ],
};
