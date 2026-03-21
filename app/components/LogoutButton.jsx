"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center justify-center md:justify-start w-full px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
    >
      <LogOut className="w-5 h-5 md:mr-3" />
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}