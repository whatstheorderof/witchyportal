import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { LOCALE_COOKIE, LOCALE_HEADER, PATH_HEADER, isLocale, localePath, splitLocale } from "@/i18n/config";

/**
 * 1. Tidies malformed addresses: bots probe URLs ending in a backslash
 *    ("/about\\", sent as /about%5C), which crash Vercel's page lookup with a
 *    500. They are redirected to the clean address instead.
 * 2. Languages: /es/…, /zh/… etc. are rewritten to the same pages with the
 *    language in a request header (src/i18n). A visitor who chose a language
 *    with the picker (cookie) is sent to that language's address.
 * 3. First line of defence for /admin. Every admin page and server action
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
  if (!pathname.startsWith("/admin")) return localise(request);
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

function localise(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  // "?lang=en" (the "Open the English page" link): remember English and drop the parameter
  if (request.nextUrl.searchParams.get("lang") === "en") {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, "en", { path: "/", maxAge: 31536000, sameSite: "lax" });
    return res;
  }
  const { locale, path } = splitLocale(pathname);
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  headers.set(PATH_HEADER, path.split("?")[0]);
  if (locale !== "en") {
    const url = request.nextUrl.clone();
    if (/^\/(admin|api)(\/|$)/.test(path)) { url.pathname = path; return NextResponse.redirect(url, 308); }
    url.pathname = path;
    return NextResponse.rewrite(url, { request: { headers } });
  }
  // Unprefixed (English) address, but the visitor picked another language: go there.
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen) && chosen !== "en" && request.method === "GET" && (request.headers.get("accept") ?? "").includes("text/html")) {
    return NextResponse.redirect(new URL(localePath(chosen, pathname) + search, request.url), 307);
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Every page (for languages) and admin; not API routes, Next's own files or static files.
  matcher: ["/((?!api/|_next/|.*\\.[a-zA-Z0-9]{2,5}$).*)", "/((?!_next/).*(?:%5[cC]|\\\\).*)"],
};
