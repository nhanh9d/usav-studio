import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SIGN_IN_PATH = "/booster/auth/signin";

// The only Account Booster pages open for now. The store pages (products, cart, minigame, news…) stay in the
// code but are hidden: any other /booster path sends the visitor back to their home screen.
// /booster itself is handled separately below, since as a prefix it would match everything.
const OPEN_PATHS = [
  "/booster/book",
  "/booster/shifts",
  "/booster/no-access",
  "/booster/admin/orders",
  "/booster/admin/shifts",
];

// Home screen per role, shown at /booster. Admins go to the admin area instead.
const HOME_BY_ROLE: Record<string, string> = {
  booster: "/booster/shifts",
  buyer: "/booster/book",
};

const isOpen = (pathname: string) => OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// Every Account Booster page requires a Discord login; the role comes from the user's roles in the Discord
// server (see src/lib/discord.ts).
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === SIGN_IN_PATH) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL(SIGN_IN_PATH, req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }
  const role = typeof token.role === "string" ? token.role : "user";

  if (pathname === "/booster") {
    if (role === "admin") return NextResponse.redirect(new URL("/booster/admin/orders", req.url));
    return NextResponse.rewrite(new URL(HOME_BY_ROLE[role] ?? "/booster/no-access", req.url));
  }

  if (!isOpen(pathname)) {
    return NextResponse.redirect(new URL("/booster", req.url));
  }

  if (pathname.startsWith("/booster/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/booster", req.url));
  }

  if (pathname.startsWith("/booster/shifts") && role !== "booster" && role !== "admin") {
    return NextResponse.redirect(new URL("/booster", req.url));
  }

  if (pathname.startsWith("/booster/book") && role !== "buyer" && role !== "admin") {
    return NextResponse.redirect(new URL("/booster", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booster/:path*"],
};
