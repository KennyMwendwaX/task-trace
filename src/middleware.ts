import {
  DEFAULT_ROUTE_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from "./routes";
import { auth } from "./auth";
import { NextRequest } from "next/server";
import { Session } from "next-auth";

export default auth(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Order of the checking the auth in routes matters
    if (isApiAuthRoute) return;

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_ROUTE_REDIRECT, nextUrl));
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/signin", nextUrl));
    }

    return;
  }
);

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
