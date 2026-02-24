import { NextResponse } from "next/server";

/**
 * Safely parse JWT payload
 */
export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const now = Math.floor(Date.now() / 1000);

  // Allow service worker and a few static root files to bypass middleware
  if (pathname === "/manifest.json" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  // Auth-only public pages (login, register etc.)
  const authPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // API routes - allow all
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Read token from cookies
  const token =
    req.cookies.get("token")?.value || req.cookies.get("accessToken")?.value;

  const payload = token ? parseJwt(token) : null;

  const isAuthenticated = payload?.exp && payload.exp > now;
  const userRole = payload?.role;

  // 🔒 Block auth pages if already logged in
  if (authPages.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // 🔓 Allow auth pages for logged-out users
  if (authPages.includes(pathname)) return NextResponse.next();

  // 🔐 All other pages require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL("/", origin);
    return NextResponse.redirect(loginUrl);
  }

  // Allow other authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};
