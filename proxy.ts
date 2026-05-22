import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const ADMIN_COOKIE = "yogmandu_admin_session";
const USER_COOKIE  = "yogmandu_user_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin protection ──────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.get(ADMIN_COOKIE)?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Account protection ────────────────────────────────────────────────────
  const publicAccountPaths = ["/account/login", "/account/register"];
  if (
    pathname.startsWith("/account") &&
    !publicAccountPaths.some(p => pathname.startsWith(p))
  ) {
    if (!request.cookies.get(USER_COOKIE)?.value) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
