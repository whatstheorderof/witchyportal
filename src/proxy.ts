import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * First line of defence for /admin. Every admin page and server action
 * also calls requireAdmin(), so a bypass here still cannot read or write data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: ["/admin", "/admin/:path*"],
};
