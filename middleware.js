import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authMiddleware = withAuth(
  function middleware(req) {
    // Get the pathname the user is trying to access
    const path = req.nextUrl.pathname;
    const userRole = req.nextauth.token?.role;
    const userEmail = req.nextauth.token?.email;

    // Check if the path is an admin route
    const isAdminRoute = path.startsWith("/admin") || path.startsWith("/manage-products");

    // If it's an admin route and the user is NOT an admin (and not your dev email), redirect to home
    // NOTE: Change the email below to your actual Google account email for testing!
    if (isAdminRoute && userRole !== "admin" && userEmail !== "your.email@gmail.com") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures the middleware function above only runs if the user is logged in.
      // If they aren't logged in at all, NextAuth automatically redirects them to the sign-in page.
      authorized: ({ token }) => !!token,
    },
  }
);

export default function middleware(req, event) {
  return authMiddleware(req, event);
}

// Define which routes this middleware should protect
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*", 
    "/manage-products",
    "/manage-products/:path*"
  ],
};