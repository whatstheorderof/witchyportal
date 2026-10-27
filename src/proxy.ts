import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * 1. Tidies malformed addresses: bots probe URLs ending in a backslash
 *    ("/about\\", sent as /about%5C), which crash Vercel's page lookup with a
 *    500. They are redirected to the clean address instead.
 * 2. First line of defence for /admin. Every admin page and server action
 * also calls requireAdmin(), so a bypass here still cannot read or write data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/%5c|\\/i.test(pathname)) {
    const clean = pathname.replace(/%5c|\\/gi, "/").replace(/\/{2,}/g, "/").replace(/(.)\/$/, "$1") || "/";
    const url = request.nextUrl.clone();
    url.pathname = clean;
    return NextResponse.redirect(url, 308);
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  // Admin pages, plus any address containing a backslash (raw or %5C-encoded).
  matcher: ["/admin", "/admin/:path*", "/((?!_next/).*(?:%5[cC]|\\\\).*)"],
};
