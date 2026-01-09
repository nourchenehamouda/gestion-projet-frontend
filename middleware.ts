import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];
const AUTH_COOKIE = "cni_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE));

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
