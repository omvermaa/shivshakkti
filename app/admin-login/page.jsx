"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

// --- Inner Component that uses SearchParams ---
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

 // Inside app/admin-login/page.jsx
const handleGoogleLogin = async () => {
  setIsLoading(true);
  await signIn("google", { callbackUrl: "/admin" }); // Admins go here
};

  return (
    <div className="w-full max-w-md relative z-10">
      <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-purple-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Store
      </Link>

      {/* Unauthorized Error Message */}
      {error === "unauthorized" && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-rose-400">Access Unauthorized</h3>
            <p className="text-xs text-rose-400/80 mt-1">
              Your email address does not have permission to access the admin portal.
            </p>
          </div>
        </div>
      )}

      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in with an authorized account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin mr-2"></div>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Page Wrapper ---
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Mystical Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Suspense Boundary is required by Next.js when using useSearchParams */}
      <Suspense fallback={<div className="text-zinc-400">Loading portal...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}