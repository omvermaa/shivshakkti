

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) { 
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    const userRole = token?.role;

    // 1. Prevent admins from seeing login pages (send them straight to dashboard)
    //    Prevent users from seeing the user-login page (send them to shop)
    if (path === "/user-login" && token) {
      return NextResponse.redirect(new URL(userRole === "admin" ? "/admin" : "/shop", req.url));
    }
    
    // NOTE: If userRole === "user", we DO NOT redirect them away from /admin-login here.
    // We let them stay so they can try to sign in with an Admin Google account.
    if (path === "/admin-login" && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // 2. Protect Admin Routes
    const isAdminRoute = path.startsWith("/admin") && path !== "/admin-login";

    if (isAdminRoute && userRole !== "admin") {
      // Redirect unauthorized users to the dedicated unauthorized warning page
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        // Always allow access to login pages AND the unauthorized page
        if (path === "/user-login" || path === "/admin-login" || path === "/unauthorized") return true;
        
        return !!token;
      },
    },
  }
);

export const config = {
  // Added /profile and /orders to the protection array!
  matcher: ["/admin/:path*", "/user-login", "/admin-login", "/unauthorized", "/profile", "/orders"],
};